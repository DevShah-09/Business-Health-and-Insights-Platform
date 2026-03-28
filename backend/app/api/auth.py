from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.database import get_db
from app.models.user import User
from app.core.security import create_access_token, verify_password, get_password_hash, SECRET_KEY, ALGORITHM
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import uuid

router = APIRouter()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    full_name: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "full_name": user.full_name
    }

@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    new_user = User(
        email=user_data.email,
        username=user_data.email.split('@')[0], # Default username from email
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password)
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(new_user.id),
        "full_name": new_user.full_name
    }

@router.put("/profile")
async def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user_data.full_name is not None:
        current_user.full_name = user_data.full_name
    
    if user_data.email is not None:
        # Check if email is already taken by another user
        if user_data.email != current_user.email:
            result = await db.execute(select(User).where(User.email == user_data.email))
            if result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            current_user.email = user_data.email
            current_user.username = user_data.email.split('@')[0]

    await db.commit()
    await db.refresh(current_user)
    
    return {
        "user_id": str(current_user.id),
        "full_name": current_user.full_name,
        "email": current_user.email
    }
