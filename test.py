
import re

def get_css(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'\.tab-btn\s*\{[^}]*\}', content)
    nav_match = re.search(r'nav\s*\{[^}]*\}', content)
    nav_content_match = re.search(r'\.nav-content\s*\{[^}]*\}', content)
    return str(nav_match.group(0) if nav_match else 'None') + '\n\n' + str(nav_content_match.group(0) if nav_content_match else 'None') + '\n\n' + str(match.group(0) if match else 'None')

print('--- INDEX.HTML ---')
print(get_css(r'e:\work\scope-manager\docs\index.html'))
print('\n--- USER-FLOW-WIREFRAME.HTML ---')
print(get_css(r'e:\work\scope-manager\docs\user-flow-wireframe.html'))

