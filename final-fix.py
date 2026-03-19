#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Final comprehensive fix for all game cards
"""

import re

def fix_all_cards(content):
    """Fix all card patterns"""
    
    # Pattern 1: Cards with img directly after article (no game-image wrapper)
    # These cards have card-buttons instead of game-overlay
    pattern1 = r'(<article class="game-card"[^>]*>)\s*(<img [^>]+>)\s*<div class="game-info">\s*<h3[^>]*class="game-title"[^>]*>(.*?)</h3>\s*<div class="card-buttons">\s*<a href="([^"]+)"[^>]*>[^<]*</a>\s*</div>\s*</div>\s*(?:</div>)?'
    
    def replace_pattern1(match):
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
    
    content = re.sub(pattern1, replace_pattern1, content, flags=re.DOTALL)
    
    # Pattern 2: Remove any remaining extra </div> after </article>
    content = re.sub(r'(</article>)\s*</div>\s*\n\s*(<article)', r'\1\n\n            \2', content)
    
    # Pattern 3: Fix cards missing </article> tag
    # Find cards that end with </div></div> but no </article>
    pattern3 = r'(<article class="game-card"[^>]*>.*?</div>\s*</div>)\s*\n\s*(<article)'
    
    def add_closing_article(match):
        card_content = match.group(1)
        next_article = match.group(2)
        
        # Check if already has </article>
        if '</article>' in card_content:
            return match.group(0)
        
        return f'{card_content}\n            </article>\n\n            {next_article}'
    
    content = re.sub(pattern3, add_closing_article, content, flags=re.DOTALL)
    
    return content

def main():
    files = ['mobile-games/index.html', 'pc-games/index.html']
    
    for filepath in files:
        print(f'\nProcessing {filepath}...')
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Count issues before
            card_buttons = content.count('<div class="card-buttons">')
            print(f'  Found {card_buttons} cards with card-buttons')
            
            # Apply fixes
            fixed_content = fix_all_cards(content)
            
            # Count after
            card_buttons_after = fixed_content.count('<div class="card-buttons">')
            print(f'  After fix: {card_buttons_after} cards with card-buttons')
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            
            print(f'  ✓ Fixed {filepath}')
            
        except Exception as e:
            print(f'  ✗ Error: {e}')
            import traceback
            traceback.print_exc()
    
    print('\n✓ All files processed!')

if __name__ == '__main__':
    main()
