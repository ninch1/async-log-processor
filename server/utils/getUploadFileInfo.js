// Extracts upload file metadata and validates supported file types
function getUploadFileInfo(originalFilename) {
  const acceptedFileTypes = ['txt', 'log'];

  // Split filename to inspect extension(s), e.g. "app.log.gz"
  const parts = originalFilename.split('.');
  let fileType = parts[parts.length - 1];

  let isGzip = false;

  // If uploaded file is gzip-compressed, use the extension before ".gz"
  if (fileType === 'gz') {
    isGzip = true;
    fileType = parts[parts.length - 2];
  }

  // Only allow plain or gzip-compressed text/log files
  const isValid = acceptedFileTypes.includes(fileType);

  // Preserve whether the saved file should end with ".gz"
  const savedExtension = isGzip ? `${fileType}.gz` : fileType;

  return {
    isValid,
    fileType,
    isGzip,
    savedExtension,
  };
}

module.exports = getUploadFileInfo;
