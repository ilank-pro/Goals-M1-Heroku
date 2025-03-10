import sqlite3
import os

def migrate_database():
    """
    Add is_private column to goals table
    """
    # Get the database path
    db_path = os.path.join('app', 'org_structure.db')
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if the column already exists
        cursor.execute("PRAGMA table_info(goals)")
        columns = cursor.fetchall()
        column_names = [column[1] for column in columns]
        
        if 'is_private' not in column_names:
            print("Adding is_private column to goals table...")
            # Add the is_private column with default value of False (0)
            cursor.execute("ALTER TABLE goals ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT 0")
            conn.commit()
            print("Migration completed successfully!")
        else:
            print("Column is_private already exists. No migration needed.")
            
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database() 