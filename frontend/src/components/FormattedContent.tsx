import styles from './FormattedContent.module.css';

interface FormattedContentProps {
  content: string;
}

const FormattedContent = ({ content }: FormattedContentProps) => {
  // Split content by newlines
  const lines = content.split('\n');
  
  const formatLine = (line: string, index: number) => {
    const trimmed = line.trim();
    
    // Empty line
    if (!trimmed) {
      return <br key={index} />;
    }
    
    // Check if line starts with emoji or bullet indicators
    const bulletIndicators = ['✅', '🎨', '✍️', '💻', '•', '-', '*', '🟩', '🎥', '🎬', '🏎️', '🗓', '🕐', '📍', '💰', '📞', '📝', '🔗', '⏳', '👉', '📅', '🌐'];
    const startsWithBullet = bulletIndicators.some(indicator => trimmed.startsWith(indicator));
    
    // Check if line starts with number followed by dot (e.g., "1. ", "2. ")
    const startsWithNumber = /^\d+\.\s/.test(trimmed);
    
    if (startsWithBullet || startsWithNumber) {
      return (
        <li key={index} className={styles.bulletItem}>
          {trimmed}
        </li>
      );
    }
    
    // Check if it's a header (all caps or ends with colon)
    const isHeader = (trimmed === trimmed.toUpperCase() && trimmed.length > 10) || 
                     (trimmed.endsWith(':') && trimmed.length < 50);
    
    if (isHeader) {
      return (
        <p key={index} className={styles.header}>
          {trimmed}
        </p>
      );
    }
    
    // Regular paragraph
    return (
      <p key={index} className={styles.paragraph}>
        {trimmed}
      </p>
    );
  };

  // Group consecutive bullet items into lists
  const elements: React.ReactElement[] = [];
  let currentList: React.ReactElement[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const bulletIndicators = ['✅', '🎨', '✍️', '💻', '•', '-', '*', '🟩', '🎥', '🎬', '🏎️', '🗓', '🕐', '📍', '💰', '📞', '📝', '🔗', '⏳', '👉', '📅', '🌐'];
    const startsWithBullet = bulletIndicators.some(indicator => trimmed.startsWith(indicator));
    const startsWithNumber = /^\d+\.\s/.test(trimmed);
    
    if (startsWithBullet || startsWithNumber) {
      currentList.push(formatLine(line, index));
    } else {
      // If we have accumulated list items, add them as a ul
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className={styles.list}>
            {currentList}
          </ul>
        );
        currentList = [];
      }
      // Add the non-list element
      elements.push(formatLine(line, index));
    }
  });
  
  // Add any remaining list items
  if (currentList.length > 0) {
    elements.push(
      <ul key={`list-${elements.length}`} className={styles.list}>
        {currentList}
      </ul>
    );
  }

  return <div className={styles.content}>{elements}</div>;
};

export default FormattedContent;
