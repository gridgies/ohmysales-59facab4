-- Create retailers table
CREATE TABLE IF NOT EXISTS retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_retailers_name ON retailers(name);

-- Insert some common German retailers to get started
INSERT INTO retailers (name, logo, website) VALUES
  ('H&M', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/320px-H%26M-Logo.svg.png', 'https://www2.hm.com/de_de/index.html'),
  ('Zara', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/320px-Zara_Logo.svg.png', 'https://www.zara.com/de/'),
  ('Zalando', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Zalando_logo.svg/320px-Zalando_logo.svg.png', 'https://www.zalando.de/'),
  ('About You', 'https://cdn.aboutstatic.com/file/images/7b7c3bd8e39a6ffe7ebe15e07e3285b8.png', 'https://www.aboutyou.de/'),
  ('Mango', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mango_Logo.svg/320px-Mango_Logo.svg.png', 'https://shop.mango.com/de')
ON CONFLICT (name) DO NOTHING;

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_retailers_updated_at
BEFORE UPDATE ON retailers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
