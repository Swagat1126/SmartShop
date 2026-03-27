const intents = [

    {
        keywords: ["hello", "hi", "hey"],
        response: "Hi! 👋 Welcome to SmartShop. How can I help you today?"
    },

    {
        keywords: ["product", "items", "shop", "buy"],
        response: "🛍️ You can explore products from categories like Phones, Electronics, Gaming, etc."
    },

    {
        keywords: ["price", "cost"],
        response: "💰 Prices are shown on each product. You can also use filters to find products in your budget."
    },

    {
        keywords: ["cart", "add to cart"],
        response: "🛒 To add items, click on 'Add to Cart' button on any product."
    },

    {
        keywords: ["remove cart", "delete cart"],
        response: "🗑️ You can remove items from cart in the cart page."
    },

    {
        keywords: ["order", "checkout"],
        response: "📦 To place an order, go to cart and click checkout."
    },

    {
        keywords: ["delivery", "shipping"],
        response: "🚚 Delivery details and time will be shown during checkout."
    },

    {
        keywords: ["return", "refund"],
        response: "↩️ You can request a return within 7 days of delivery."
    },

    {
        keywords: ["filter", "search"],
        response: "🔍 Use search and filters on category pages to find products easily."
    },

    {
        keywords: ["categories"],
        response: "📂 We have categories like Phones, Electronics, Gaming, Watches, Headphones, etc."
    },

    {
        keywords: ["offer", "discount"],
        response: "🔥 Check the homepage banners and flash sale section for latest offers."
    },

    {
        keywords: ["admin"],
        response: "⚙️ Admin can manage products, orders and stock from admin dashboard."
    },

    {
        keywords: ["contact", "support"],
        response: "📞 You can contact support from the contact page."
    },

    {
        keywords: ["payment"],
        response: "💳 Payment options will be available during checkout."
    },

    {
        keywords: ["thanks", "thank you"],
        response: "😊 You're welcome! Happy shopping at SmartShop!"
    },

    {
        keywords: ["bye"],
        response: "👋 Goodbye! Visit again!"
    },

    {
        keywords: ["how to login", "login kaise kare", "sign in kaise kare"],
        response: "🔐 To login, go to the Login page from the navbar, enter your email and password, and click on login."
    },

    {
        keywords: ["how to signup", "signup kaise kare", "register kaise kare"],
        response: "📝 To create an account, go to the Signup page, fill your details like name, email, password and click on register."
    },

    {
        keywords: ["forgot password", "password reset"],
        response: "🔑 Currently password reset is not available. Please remember your login credentials."
    },

    {
        keywords: ["admin login", "how admin login"],
        response: "⚙️ Admin can login using the same login page. If your role is admin, you will be redirected to the admin dashboard."
    },

    {
        keywords: ["cant login", "login issue", "problem login"],
        response: "❌ Please check your email and password. If not registered, please signup first."
    },

];

export default intents;