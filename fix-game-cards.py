#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to fix game card HTML structure in mobile-games and pc-games index files
"""

import re

def fix_game_cards(content):
    """Fix game card structure to match the main page design"""
    
    # Pattern to match game cards
    card_pattern = r'(<article class="game-card"[^>]*>)(.*?)(</article>)'
    
    def fix_single_card(match):
        opening = match.group(1)
        card_content = match.group(2)
        closing = match.group(3)
        
        # Extract image src and alt
        img_match = re.search(r'<img\s+([^>]*?)>', card_content, re.DOTALL)
        if not img_match:
            return match.group(0)  # Return unchanged if no image found
        
        img_attrs = img_match.group(1)
        
        # Extract game title
        title_match = re.search(r'<h3[^>]*class="game-title"[^>]*>(.*?)</h3>', card_content, re.DOTALL)
        if not title_match:
            return match.group(0)
        
        game_title = title_match.group(1).strip()
        
        # Extract game category
        category_match = re.search(r'<span[^>]*class="game-category"[^>]*>(.*?)</span>', card_content, re.DOTALL)
        game_category = category_match.group(1).strip() if category_match else 'لعبة'
        
        # Extract rating
        rating_match = re.search(r'<span[^>]*class="game-rating"[^>]*>.*?(\d+\.\d+)\s*</span>', card_content, re.DOTALL)
        game_rating = rating_match.group(1) if rating_match else '4.5'
        
        # Extract detail link
        detail_match = re.search(r'href="(details/[^"]+)"', card_content)
        detail_link = detail_match.group(1) if detail_match else '#'
        
        # Build correct structure
        fixed_card = f'''{opening}
                <div class="game-image">
                    <img {img_attrs}>
                    <div class="game-overlay">
                        <a href="{detail_link}" class="btn btn-sm btn-white">عرض التفاصيل</a>
                    </div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">{game_title}</h3>
                    <div class="game-meta">
                        <span class="game-category">{game_category}</span>
                        <span class="game-rating">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            {game_rating}
                        </span>
                    </div>
                </div>
            {closing}'''
        
        return fixed_card
    
    # Fix all game cards
    fixed_content = re.sub(card_pattern, fix_single_card, content, flags=re.DOTALL)
    
    # Remove extra closing divs after articles
    fixed_content = re.sub(r'(</article>)\s*</div>\s*(?=\s*<article)', r'\1\n\n            ', fixed_content)
    
    return fixed_content

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
            
            # Count cards before
            cards_before = content.count('<article class="game-card"')
            print(f'  Found {cards_before} game cards')
            
            # Fix the content
            fixed_content = fix_game_cards(content)
            
            # Count cards after
            cards_after = fixed_content.count('<article class="game-card"')
            print(f'  After fix: {cards_after} game cards')
            
            # Backup original
            with open(f'{filepath}.backup', 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'  Backup saved to {filepath}.backup')
            
            # Write fixed content
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print(f'  ✓ Fixed {filepath}')
            
        except Exception as e:
            print(f'  ✗ Error processing {filepath}: {e}')
    
    print('\nDone!')

if __name__ == '__main__':
    main()
