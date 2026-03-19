#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive fix for all game card issues
"""

import re

def fix_mobile_games(content):
    """Fix mobile games HTML structure"""
    
    # Remove all extra </div> after </article>
    content = re.sub(r'(</article>)\s*</div>\s*\n\s*(<article)', r'\1\n\n            \2', content)
    
    # Fix cards that don't have proper structure (missing game-image wrapper)
    # Pattern: <article...> <img (no game-image div)
    def fix_card_without_wrapper(match):
        article_tag = match.group(1)
        img_tag = match.group(2)
        rest = match.group(3)
        
        # Check if this card already has game-image div
        if '<div class="game-image">' in rest[:100]:
            return match.group(0)
        
        # Extract detail link if exists
        detail_match = re.search(r'href="(details/[^"]+)"', rest)
        detail_link = detail_match.group(1) if detail_match else '#'
        
        # Extract game title
        title_match = re.search(r'<h3[^>]*class="game-title"[^>]*>(.*?)</h3>', rest, re.DOTALL)
        game_title = title_match.group(1).strip() if title_match else 'Game'
        
        # Extract category from card-buttons section or default
        category = 'لعبة'
        
        # Build proper structure
        fixed = f'''{article_tag}
                <div class="game-image">
                    {img_tag}
                    <div class="game-overlay">
                        <a href="{detail_link}" class="btn btn-sm btn-white">عرض التفاصيل</a>
                    </div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">{game_title}</h3>
                    <div class="game-meta">
                        <span class="game-category">{category}</span>
                        <span class="game-rating">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            4.5
                        </span>
                    </div>
                </div>
            </article>'''
        
        return fixed
    
    # Fix cards with img directly after article (no game-image div)
    content = re.sub(
        r'(<article class="game-card"[^>]*>)\s*(<img [^>]+>)(.*?)</article>',
        fix_card_without_wrapper,
        content,
        flags=re.DOTALL
    )
    
    return content

def main():
    print('Fixing mobile-games/index.html...')
    
    try:
        with open('mobile-games/index.html', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count issues before
        extra_divs = len(re.findall(r'</article>\s*</div>\s*\n\s*<article', content))
        print(f'  Found {extra_divs} extra closing divs')
        
        # Fix
        fixed_content = fix_mobile_games(content)
        
        # Count after
        extra_divs_after = len(re.findall(r'</article>\s*</div>\s*\n\s*<article', fixed_content))
        print(f'  After fix: {extra_divs_after} extra closing divs')
        
        # Write
        with open('mobile-games/index.html', 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print('  ✓ Fixed mobile-games/index.html')
        
    except Exception as e:
        print(f'  ✗ Error: {e}')
    
    print('\nDone!')

if __name__ == '__main__':
    main()
