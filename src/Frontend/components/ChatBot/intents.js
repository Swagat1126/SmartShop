const intents = [
    {
        keywords: ["hello", "hi", "hey"],
        response: "Hi! Welcome to SmartShop. How can I assist you today?"
    },
    {
        keywords: ["product", "items", "shop"],
        response: "You can browse products in the explore section or homepage categories."
    },
    {
        keywords: ["price", "cost"],
        response: "Prices are displayed on each product card. Let me know if you need help comparing!"
    },
    {
        keywords: ["order", "buy"],
        response: "To place an order, select a product and proceed to checkout."
    },
    {
        keywords: ["delivery", "shipping"],
        response: "We offer fast delivery. Estimated time will be shown during checkout."
    },
    {
        keywords: ["return", "refund"],
        response: "You can request a return within 7 days of delivery."
    },
    {
        keywords: ["contact", "support"],
        response: "You can reach support via the contact section."
    }
];

export default intents;