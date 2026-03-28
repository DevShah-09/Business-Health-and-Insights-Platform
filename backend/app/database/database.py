"""
database.py — Async SQLAlchemy engine + session factory (SQLite version)
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.config.settings import settings

# ✅ Make sure settings.DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# engine = create_async_engine(
#     settings.DATABASE_URL,
#     echo=settings.DEBUG,
# )

# Handle SQLite specifically for development
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
engine_kwargs = {"echo": settings.DEBUG}

if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # ✅ Required for Supabase/PgBouncer (Transaction Mode)
    # Disables prepared statements which are not supported by PgBouncer
    engine_kwargs["connect_args"] = {
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,
    }

engine = create_async_engine(settings.DATABASE_URL, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables on startup."""
    async with engine.begin() as conn:
        from app.models import user, business, transaction, report  # noqa
        await conn.run_sync(Base.metadata.create_all)