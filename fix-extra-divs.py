#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to remove extra closing divs after game cards
"""

import re

def fix_extra_divs(content):
    """Remove extra </div> tags after </article>"""
    
    # Pattern: </article> followed by </div> (not part of a game-image or game-info)
    # Replace with just </article>
    fixed = re.sub(r'(</article>)\s*</div>\s*(?=\s*<article)', r'\1\n\n            ', content)
    
    return fixed

def main():
    files_to_fix = [
        'mobile-games/index.html',
        'pc-games/index.html'
    ]
    
    for filepath in files_to_fix:
        print(f'Processing {filepath}...')
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Count extra divs
            extra_divs_before = len(re.findall(r'</article>\s*</div>\s*<article', content))
            print(f'  Found {extra_divs_before} extra closing divs')
            
            # Fix the content
            fixed_content = fix_extra_divs(content)
            
            # Count after
            extra_divs_after = len(re.findall(r'</article>\s*</div>\s*<article', fixed_content))
            print(f'  After fix: {extra_divs_after} extra closing divs')
            
            # Write fixed content
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print(f'  ✓ Fixed {filepath}')
            
        except Exception as e:
            print(f'  ✗ Error processing {filepath}: {e}')
    
    print('\nDone!')

if __name__ == '__main__':
    main()
