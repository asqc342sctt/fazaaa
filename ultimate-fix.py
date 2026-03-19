#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ultimate fix for all remaining game card issues
"""

import re

def ultimate_fix(content):
    """Fix all remaining card issues"""
    
    # Pattern: Cards with img directly, game-info, card-buttons, but missing closing tags
    # <article...> <img...> <div class="game-info"> <h3>Title</h3> <div class="card-buttons"> <a>...</a> </div>
    # Missing: </div> for game-info and </article>
    
    pattern = r'(<article class="game-card"[^>]*>)\s*(<img [^>]+>)\s*<div class="game-info">\s*<h3[^>]*class="game-title"[^>]*>(.*?)</h3>\s*<div class="card-buttons">\s*<a href="([^"]+)"[^>]*>([^<]*)</a>\s*</div>\s*(?!</div>)'
    
    def fix_card(match):
        article_tag = match.group(1)
        img_tag = match.group(2)
        title = match.group(3).strip()
        link = match.group(4)
        
        return f'''{article_tag}
                <div class="game-image">
                    {img_tag}
                    <div class="game-overlay">
                        <a href="{link}" class="btn btn-sm btn-white">عرض التفاصيل</a>
                    </div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">{title}</h3>
                    <div class="game-meta">
                        <span class="game-category">لعبة</span>
                        <span class="game-rating">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            4.5
                        </span>
                    </div>
                </div>
            </article>'''
    
    fixed = re.sub(pattern, fix_card, content, flags=re.DOTALL)
    
    # Also fix any remaining </div> after </article>
    fixed = re.sub(r'(</article>)\s*</div>\s*\n\s*(<article)', r'\1\n\n            \2', fixed)
    
    return fixed

def main():
    filepath = 'mobile-games/index.html'
    
    print(f'Processing {filepath}...')
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count before
        card_buttons_before = content.count('<div class="card-buttons">')
        print(f'  Before: {card_buttons_before} cards with card-buttons')
        
        # Fix
        fixed_content = ultimate_fix(content)
        
        # Count after
        card_buttons_after = fixed_content.count('<div class="card-buttons">')
        print(f'  After: {card_buttons_after} cards with card-buttons')
        print(f'  Fixed: {card_buttons_before - card_buttons_after} cards')
        
        # Write
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f'  ✓ Done!')
        
    except Exception as e:
        print(f'  ✗ Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
