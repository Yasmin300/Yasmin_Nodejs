import Joi from "joi";

export const cardSchema = Joi.object({
    title: Joi.string().min(2).max(256).required().messages({
        "string.empty": "יש להזין כותרת",
        "string.min": "כותרת חייבת להכיל לפחות 2 תווים",
        "string.max": "כותרת יכולה להכיל עד 256 תווים",
        "any.required": "כותרת היא שדה חובה",
    }),

    subtitle: Joi.string().min(2).max(256).allow('').optional().messages({
        "string.min": "כותרת משנה חייבת להכיל לפחות 2 תווים",
        "string.max": "כותרת משנה יכולה להכיל עד 256 תווים",
    }),

    description: Joi.string().min(2).max(1024).allow('').optional().messages({
        "string.min": "תיאור חייב להכיל לפחות 2 תווים",
        "string.max": "תיאור יכול להכיל עד 1024 תווים",
    }),

    phone: Joi.string().pattern(/^0\d{8,9}$/).required().messages({
        "string.empty": "יש להזין טלפון",
        "string.pattern.base": "מספר טלפון חייב להיות ישראלי תקני (למשל: 0501234567, 031234567)",
        "any.required": "טלפון הוא שדה חובה",
    }),

    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "string.empty": "יש להזין אימייל",
        "string.email": "אימייל לא תקין",
        "any.required": "אימייל הוא שדה חובה",
    }),

    web: Joi.string().uri().allow('').optional().messages({
        "string.uri": "כתובת אתר אינטרנט לא תקינה",
    }),

    address: Joi.object({
        state: Joi.string().min(2).max(256).allow('').messages({
            "string.min": "שם היישוב חייב להכיל לפחות 2 תווים",
            "string.max": "שם היישוב יכול להכיל עד 256 תווים",
        }),
        country: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין מדינה",
            "string.min": "שם המדינה חייב להכיל לפחות 2 תווים",
            "string.max": "שם המדינה יכול להכיל עד 256 תווים",
            "any.required": "מדינה היא שדה חובה",
        }),
        city: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין עיר",
            "string.min": "שם העיר חייב להכיל לפחות 2 תווים",
            "string.max": "שם העיר יכול להכיל עד 256 תווים",
            "any.required": "עיר היא שדה חובה",
        }),
        street: Joi.string().min(2).max(256).required().messages({
            "string.empty": "יש להזין רחוב",
            "string.min": "שם הרחוב חייב להכיל לפחות 2 תווים",
            "string.max": "שם הרחוב יכול להכיל עד 256 תווים",
            "any.required": "רחוב הוא שדה חובה",
        }),
        houseNumber: Joi.number().min(1).required().messages({
            "number.base": "מספר בית חייב להיות מספר",
            "number.min": "מספר בית חייב להיות גדול מ-0",
            "any.required": "מספר בית הוא שדה חובה",
        }),
        zip: Joi.number().min(1).optional().messages({
            "number.base": "מיקוד חייב להיות מספר",
            "number.min": "מיקוד חייב להיות גדול מ-0",
        }),
    }).required().messages({
        "any.required": "יש לספק אובייקט כתובת",
    }),

    image: Joi.object({
        url: Joi.string().uri().allow('').optional().messages({
            "string.uri": "קישור לתמונה לא תקין",
        }),
        alt: Joi.string().min(2).max(256).allow('').optional().messages({
            "string.min": "תיאור התמונה חייב להכיל לפחות 2 תווים",
            "string.max": "תיאור התמונה יכול להכיל עד 256 תווים",
        }),
    })
        .optional()
        .with('url', 'alt')  // if url exists → alt must exist
        .with('alt', 'url'),  // if alt exists → url must exist,

    likes: Joi.array().items(Joi.string().length(24).hex()).optional()  // array of user ids (MongoDB ObjectId strings)
});

export const cardEditSchema = Joi.object({
    title: Joi.string().min(2).max(256).optional().messages({
        "string.min": "כותרת חייבת להכיל לפחות 2 תווים",
        "string.max": "כותרת יכולה להכיל עד 256 תווים",
    }),

    subtitle: Joi.string().min(2).max(256).allow('').optional(),
    description: Joi.string().min(2).max(1024).allow('').optional(),

    phone: Joi.string().pattern(/^0\d{8,9}$/).optional().messages({
        "string.pattern.base": "מספר טלפון חייב להיות ישראלי תקני (למשל: 0501234567, 031234567)",
    }),

    email: Joi.string().email({ tlds: { allow: false } }).optional().messages({
        "string.email": "אימייל לא תקין",
    }),

    web: Joi.string().uri().allow('').optional(),

    address: Joi.object({
        state: Joi.string().min(2).max(256).allow('').optional(),
        country: Joi.string().min(2).max(256).optional().messages({
            "string.min": "שם המדינה חייב להכיל לפחות 2 תווים",
            "string.max": "שם המדינה יכול להכיל עד 256 תווים",
        }),
        city: Joi.string().min(2).max(256).optional(),
        street: Joi.string().min(2).max(256).optional(),
        houseNumber: Joi.number().min(1).optional(),
        zip: Joi.number().min(1).optional(),
    }).optional(),

    image: Joi.object({
        url: Joi.string().uri().allow('').optional().messages({
            "string.uri": "קישור לתמונה לא תקין",
        }),
        alt: Joi.string().min(2).max(256).allow('').optional().messages({
            "string.min": "תיאור התמונה חייב להכיל לפחות 2 תווים",
            "string.max": "תיאור התמונה יכול להכיל עד 256 תווים",
        }),
    })
        .optional()
        .with('url', 'alt')  // if url exists → alt must exist
        .with('alt', 'url'),

    likes: Joi.array().items(Joi.string().length(24).hex()).optional()
});
