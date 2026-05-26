export function requireFields(fields) {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Campos obrigatorios ausentes",
        fields: missingFields,
      });
    }

    next();
  };
}
