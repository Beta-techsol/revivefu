-- Insert sample blog posts
INSERT INTO blog_posts (
    title, slug, content, excerpt, featured_image, author_name, status, 
    is_featured, meta_title, meta_description, tags, category, published_at
) VALUES 
(
    'Top 5 Timeless Wood Finishes for Modern Homes in 2024',
    'timeless-wood-finishes-2024',
    '<p>When it comes to choosing the perfect wood finish for your furniture, the options can seem overwhelming. However, some finishes have stood the test of time and continue to be popular choices for modern homes.</p>

<h2>1. Classic Oak Finish</h2>
<p>Oak has been a favorite for centuries, and for good reason. Its distinctive grain pattern and warm honey tones make it versatile enough to work in both traditional and contemporary settings.</p>

<h2>2. Rich Walnut Stain</h2>
<p>Walnut offers a sophisticated, dark chocolate brown finish that exudes elegance and luxury. This premium wood finish is perfect for creating statement pieces.</p>

<h2>3. Natural Cherry Wood</h2>
<p>Cherry wood is prized for its smooth grain and beautiful reddish-brown color that deepens with age and exposure to light.</p>

<h2>4. Weathered Gray Finish</h2>
<p>The weathered gray finish has gained tremendous popularity in recent years, offering a modern, coastal-inspired look.</p>

<h2>5. Espresso Dark Stain</h2>
<p>For those who prefer dramatic, bold furniture pieces, espresso stain delivers rich, dark tones that create striking focal points.</p>',
    'Discover the most popular wood finishes that never go out of style and learn how to choose the perfect one for your furniture pieces.',
    '/shop/products/dining-table-1.jpg',
    'Sarah Johnson',
    'published',
    true,
    'Top 5 Timeless Wood Finishes for Modern Homes in 2024',
    'Discover the most popular wood finishes that never go out of style and learn how to choose the perfect one for your furniture pieces.',
    '["Wood Finishes", "Interior Design", "Furniture", "Home Decor", "Design Tips"]',
    'Design Tips',
    CURRENT_TIMESTAMP
),
(
    'How to Care for Leather Furniture: A Complete Guide',
    'leather-furniture-care-guide',
    '<p>Leather furniture is a significant investment that can last for decades with proper care. This comprehensive guide will help you maintain your leather pieces in pristine condition.</p>

<h2>Understanding Leather Types</h2>
<p>Different types of leather require different care approaches. Full-grain leather, top-grain leather, and bonded leather each have unique characteristics.</p>

<h2>Daily Maintenance</h2>
<p>Regular dusting and immediate cleanup of spills are essential for leather furniture longevity.</p>

<h2>Deep Cleaning Process</h2>
<p>Learn the step-by-step process for deep cleaning your leather furniture safely.</p>

<h2>Conditioning and Protection</h2>
<p>Regular conditioning keeps leather supple and prevents cracking and fading.</p>

<h2>Common Mistakes to Avoid</h2>
<p>Avoid these common leather care mistakes that can damage your furniture permanently.</p>',
    'Learn the essential tips and techniques to keep your leather furniture looking pristine for years to come.',
    '/shop/products/sofa-1.jpg',
    'Michael Chen',
    'published',
    false,
    'How to Care for Leather Furniture: Complete Care Guide',
    'Learn essential tips and techniques to keep your leather furniture looking pristine for years to come with our comprehensive care guide.',
    '["Leather Care", "Furniture Maintenance", "Home Care", "Furniture Tips"]',
    'Furniture Care',
    CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
    'Small Space, Big Style: Maximizing Your Studio Apartment',
    'small-space-big-style',
    '<p>Living in a small space doesn''t mean sacrificing style or functionality. With the right furniture choices and design strategies, you can create a beautiful and practical home.</p>

<h2>Multi-Functional Furniture</h2>
<p>Invest in pieces that serve multiple purposes, such as storage ottomans, expandable dining tables, and sofa beds.</p>

<h2>Vertical Storage Solutions</h2>
<p>Make use of wall space with floating shelves, tall bookcases, and wall-mounted storage units.</p>

<h2>Color and Light</h2>
<p>Light colors and strategic lighting can make small spaces feel larger and more open.</p>

<h2>Room Dividers</h2>
<p>Create separate zones in your studio apartment using furniture as room dividers.</p>

<h2>Minimalist Approach</h2>
<p>Embrace minimalism to avoid clutter and create a sense of spaciousness.</p>',
    'Transform your compact living space into a stylish and functional home with these expert interior design tips.',
    '/shop/products/chair-1.jpg',
    'Emma Rodriguez',
    'published',
    false,
    'Small Space, Big Style: Maximizing Your Studio Apartment',
    'Transform your compact living space into a stylish and functional home with these expert interior design tips and space-saving furniture solutions.',
    '["Small Spaces", "Studio Apartment", "Interior Design", "Space Saving", "Minimalist"]',
    'Room Makeovers',
    CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
    'Sustainable Furniture: Why Eco-Friendly Choices Matter',
    'sustainable-furniture-choices',
    '<p>As environmental consciousness grows, more homeowners are seeking sustainable furniture options. Understanding the impact of our furniture choices can help create a more sustainable future.</p>

<h2>Environmental Impact of Furniture Production</h2>
<p>Traditional furniture manufacturing often involves harmful chemicals, excessive waste, and unsustainable harvesting practices.</p>

<h2>Sustainable Materials</h2>
<p>Explore eco-friendly materials like reclaimed wood, bamboo, recycled metals, and organic fabrics.</p>

<h2>Certifications to Look For</h2>
<p>Learn about FSC certification, GREENGUARD standards, and other eco-friendly certifications.</p>

<h2>Local and Handcrafted Options</h2>
<p>Supporting local artisans and manufacturers reduces transportation emissions and supports local economies.</p>

<h2>Longevity and Quality</h2>
<p>Investing in high-quality, durable furniture reduces the need for frequent replacements.</p>',
    'Explore the environmental impact of furniture production and discover how choosing sustainable options can make a difference.',
    '/shop/products/bed-1.jpg',
    'David Green',
    'published',
    false,
    'Sustainable Furniture: Why Eco-Friendly Choices Matter',
    'Explore the environmental impact of furniture production and discover how choosing sustainable options can make a difference for our planet.',
    '["Sustainability", "Eco-Friendly", "Green Living", "Environmental", "Conscious Living"]',
    'Sustainability',
    CURRENT_TIMESTAMP - INTERVAL '7 days'
),
(
    '2024 Interior Design Trends: What''s Hot This Year',
    'interior-design-trends-2024',
    '<p>Stay ahead of the curve with the latest interior design trends that are shaping homes in 2024. From bold colors to innovative materials, discover what''s trending.</p>

<h2>Color Trends</h2>
<p>Warm earth tones, sage greens, and rich burgundies are dominating color palettes this year.</p>

<h2>Texture and Materials</h2>
<p>Mixed textures, natural materials, and artisanal finishes are creating depth and interest in modern interiors.</p>

<h2>Furniture Styles</h2>
<p>Curved furniture, statement lighting, and vintage-modern combinations are trending.</p>

<h2>Sustainable Design</h2>
<p>Eco-conscious design choices are becoming mainstream, not just trendy.</p>

<h2>Technology Integration</h2>
<p>Smart home features are being seamlessly integrated into furniture design.</p>',
    'Stay ahead of the curve with the latest interior design trends that are shaping homes in 2024.',
    '/shop/products/coffee-table-1.jpg',
    'Lisa Park',
    'published',
    true,
    '2024 Interior Design Trends: What''s Hot This Year',
    'Stay ahead of the curve with the latest interior design trends that are shaping homes in 2024, from color palettes to furniture styles.',
    '["Interior Design", "Trends 2024", "Home Decor", "Design Inspiration", "Modern Design"]',
    'Interior Trends',
    CURRENT_TIMESTAMP - INTERVAL '10 days'
),
(
    'The Ultimate Guide to Choosing the Perfect Dining Table',
    'choosing-perfect-dining-table',
    '<p>The dining table is often the centerpiece of your dining room and a gathering place for family and friends. Choosing the right one requires careful consideration of several factors.</p>

<h2>Size and Space Considerations</h2>
<p>Measure your space carefully and consider how many people you need to seat regularly versus occasionally.</p>

<h2>Shape Matters</h2>
<p>Round tables promote conversation, rectangular tables are classic and space-efficient, while square tables work well in smaller spaces.</p>

<h2>Material Options</h2>
<p>Wood, glass, metal, and composite materials each offer different benefits and aesthetic appeals.</p>

<h2>Style Coordination</h2>
<p>Ensure your dining table complements your existing decor and personal style preferences.</p>

<h2>Budget and Quality</h2>
<p>Balance your budget with quality considerations to make a purchase you''ll be happy with for years.</p>',
    'From size considerations to material options, learn everything you need to know to select the ideal dining table for your home.',
    '/shop/products/wardrobe-1.jpg',
    'Robert Kim',
    'published',
    false,
    'The Ultimate Guide to Choosing the Perfect Dining Table',
    'From size considerations to material options, learn everything you need to know to select the ideal dining table for your home.',
    '["Dining Table", "Furniture Guide", "Home Furnishing", "Buying Guide", "Dining Room"]',
    'Buying Guides',
    CURRENT_TIMESTAMP - INTERVAL '12 days'
)
ON CONFLICT (slug) DO NOTHING;
