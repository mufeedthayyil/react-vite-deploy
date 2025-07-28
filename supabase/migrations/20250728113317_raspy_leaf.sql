/*
  # Add sample equipment data

  1. Sample Data
    - Add sample cameras and accessories to the equipments table
    - Ensure proper categories and pricing
  
  2. Data Integrity
    - All required fields populated
    - Proper image URLs from Pexels
    - Realistic pricing structure
*/

-- Insert sample cameras
INSERT INTO equipments (name, image_url, description, rate_12hr, rate_24hr, available, category) VALUES
('Canon EOS R5', 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional full-frame mirrorless camera with 8K video capabilities and exceptional image quality', 120, 200, true, 'Mirrorless'),
('Sony A7S III', 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Exceptional low-light performance with 4K 120p video recording for professional filmmaking', 110, 180, true, 'Mirrorless'),
('Blackmagic Pocket 6K', 'https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Super 35 cinema camera with 6K resolution and 13 stops of dynamic range for professional video production', 150, 250, true, 'Cinema Camera'),
('Nikon Z7 II', 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '45.7MP full-frame mirrorless camera with excellent dynamic range and dual card slots', 100, 160, true, 'Mirrorless'),
('RED Komodo 6K', 'https://images.pexels.com/photos/1787235/pexels-photo-1787235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Compact cinema camera with global shutter and 6K recording capabilities for high-end productions', 300, 500, true, 'Cinema Camera'),
('Fujifilm GFX 100S', 'https://images.pexels.com/photos/3497065/pexels-photo-3497065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '102MP medium format sensor in a relatively compact body for ultimate image quality', 250, 400, true, 'Medium Format'),
('Canon EOS 5D Mark IV', 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional DSLR with 30.4MP full-frame sensor and 4K video recording', 80, 130, true, 'DSLR'),
('Sony FX3', 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Full-frame cinema camera with compact design and professional video features', 140, 220, true, 'Cinema Camera');

-- Insert sample accessories
INSERT INTO equipments (name, image_url, description, rate_12hr, rate_24hr, available, category) VALUES
('DJI Ronin-S2', 'https://images.pexels.com/photos/3602258/pexels-photo-3602258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional 3-axis gimbal stabilizer for DSLRs and mirrorless cameras with advanced stabilization', 45, 75, true, 'Stabilizer'),
('Canon RF 24-70mm f/2.8', 'https://images.pexels.com/photos/16775856/pexels-photo-16775856/free-photo-of-close-up-of-a-camera-lens.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Versatile standard zoom lens with constant f/2.8 aperture for professional photography', 35, 60, true, 'Lens'),
('Sachtler Flowtech 75 Tripod', 'https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional carbon fiber tripod with innovative leg mechanism for stable shots', 40, 65, true, 'Support'),
('RODE NTG5 Shotgun Microphone', 'https://images.pexels.com/photos/164755/pexels-photo-164755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Broadcast-grade shotgun microphone for professional sound recording with superior audio quality', 30, 50, true, 'Audio'),
('Aputure 600D Pro Light', 'https://images.pexels.com/photos/2752899/pexels-photo-2752899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Powerful 600W daylight-balanced LED light with Bowens mount for professional lighting setups', 55, 90, true, 'Lighting'),
('SmallHD 5" FOCUS Monitor', 'https://images.pexels.com/photos/12550657/pexels-photo-12550657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Compact 5" on-camera monitor with 800 nits brightness and professional monitoring tools', 25, 40, true, 'Monitoring'),
('Sony FE 85mm f/1.4 GM', 'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Premium portrait lens with exceptional bokeh and sharpness for professional photography', 40, 70, true, 'Lens'),
('Manfrotto 502AH Video Head', 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Professional fluid video head with smooth pan and tilt movements for video production', 30, 50, true, 'Support'),
('Godox AD600Pro Flash', 'https://images.pexels.com/photos/2752899/pexels-photo-2752899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Portable 600W strobe light with TTL and HSS for professional photography', 50, 80, true, 'Lighting'),
('SanDisk 128GB CFexpress', 'https://images.pexels.com/photos/163117/cards-sd-card-memory-card-163117.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'High-speed 128GB CFexpress memory card for professional cameras and 8K recording', 15, 25, true, 'Storage');