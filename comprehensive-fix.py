#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive fix for all game card HTML issues
"""

import re

def comprehensive_fix(content):
    """Apply all fixes to game cards"""
    
    # Fix 1: Remove extra </div> between </article> tags
    # Pattern: </div> followed by </div> then <article
    content = re.sub(
        r'(</div>\s*</div>)\s*\n\s*(<article class="game-card")',
        r'</div>\n\n            \2',
        content
    )
    
    # Fix 2: Remove duplicate links in game-overlay
    def fix_duplicate_links(match):
        overlay_content = match.group(1)
        # Keep only the last link (usually the correct one)
        links = re.findall(r'<a href="([^"]+)"[^>]*>([^<]+)</a>', overlay_content)
        if len(links) > 1:
            # Use the details/ link if available
            detail_link = next((link for link in links if 'details/' in link[0]), links[-1])
            return f'<div class="game-overlay">\n                        <a href="{detail_link[0]}" class="btn btn-sm btn-white">{detail_link[1]}</a>\n                    </div>'
        return match.group(0)
    
    content = re.sub(
        r'<div class="game-overlay">(.*?)</div>',
        fix_duplicate_links,
        content,
        flags=re.DOTALL
    )
    
    # Fix 3: Ensure all cards have proper closing (no extra </div> after </article>)
    content = re.sub(
        r'(</article>)\s*</div>\s*\n\s*(<article)',
        r'\1\n\n            \2',
        content
    )
    
    # Fix 4: Fix cards with card-buttons instead of game-overlay
    def fix_card_buttons(match):
        article_open = match.group(1)
        img_tag = match.group(2)
        game_info = match.group(3)
        
        # Extract link from card-buttons
        link_match = re.search(r'href="([^"]+)"', game_info)
        link = link_match.group(1) if link_match else '#'
        
        # Extract title
        title_match = re.search(r'<h3[^>]*class="game-title"[^>]*>(.*?)</h3>', game_info, re.DOTALL)
        title = title_match.group(1).strip() if title_match else 'Game'
        
        # Build proper structure
        return f'''{article_open}
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
    
    # Fix cards that have img directly after article (no game-image wrapper)
    content = re.sub(
        r'(<article class="game-card"[^>]*>)\s*(<img [^>]+>)\s*(<div class="game-info">.*?</div>\s*<div class="card-buttons">.*?</div>)\s*</div>\s*</article>',
        fix_card_buttons,
        content,
        flags=re.DOTALL
    )
    
    return content

def main():
    files = ['mobile-games/index.html', 'pc-games/index.html']
    
    for filepath in files:
        print(f'\nProcessing {filepath}...')
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Apply fixes
            fixed_content = comprehensive_fix(content)
            
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
