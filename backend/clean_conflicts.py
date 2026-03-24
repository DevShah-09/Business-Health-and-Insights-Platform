import os

def clean_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    out = []
    skip = False
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            continue
        elif line.startswith('======='):
            skip = True
            continue
        elif line.startswith('>>>>>>>'):
            skip = False
            continue
        
        if not skip:
            out.append(line)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(out)
    print(f"Cleaned {filepath}")

clean_file('app/services/ai_engine.py')
clean_file('app/api/ai_insights.py')
clean_file('app/main.py')
