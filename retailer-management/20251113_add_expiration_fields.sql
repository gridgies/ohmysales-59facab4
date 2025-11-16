-- Add start_date and is_manually_expired fields to sales table
ALTER TABLE sales
ADD COLUMN start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN is_manually_expired BOOLEAN DEFAULT FALSE;

-- Update existing records to set start_date to created_at date
UPDATE sales
SET start_date = DATE(created_at)
WHERE start_date IS NULL;

-- Make start_date NOT NULL after setting defaults
ALTER TABLE sales
ALTER COLUMN start_date SET NOT NULL;

-- Add index for better query performance on date fields
CREATE INDEX idx_sales_start_date ON sales(start_date);
CREATE INDEX idx_sales_end_date ON sales(end_date);
CREATE INDEX idx_sales_expired ON sales(is_manually_expired);
