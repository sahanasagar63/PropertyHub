export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,       // Cloudinary URL
        public_id: req.file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};