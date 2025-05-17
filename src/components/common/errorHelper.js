// utils/errorHelper.js
export const formatDjangoErrors = (error) => {
  if (!error) return null;
  
  // Handle detail field (common in DRF)
  if (error.detail) {
    return error.detail;
  }
  
  // Handle non-field errors
  if (error.non_field_errors) {
    console.log("nono fieldss");
    
    return error.non_field_errors.join(' ');
  }
  
  // Handle field-specific errors
  if (typeof error === 'object') {
    return Object.entries(error).map(([field, messages]) => (
      Array.isArray(messages) 
        ? messages.map((message, i) => (
            <div key={`${field}-${i}`}>
              <strong>{field}:</strong> {message}
            </div>
          ))
        : <div key={field}><strong>{field}:</strong> {messages}</div>
    ));
  }
  
  // Fallback to simple error message
  return error.message || 'An error occurred';
};