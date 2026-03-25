export type Review = {
    name: string;
    username: string;
    body: string;
    img: string;
};

export const reviewsData: Review[] = [
    {
        name: "Jack",
        username: "@jack",
        body: "I've never seen anything like this. Ali's code is clean, scalable, and the architecture is just mind-blowing. Highly recommended for any complex project.",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "He delivered the MVP in record time. The backend architecture is solid, and the communication was seamless throughout the whole process.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "John",
        username: "@john",
        body: "Flurry Super App is mind-blowing. The real-time features are seamless. I didn't expect WebRTC to work this smoothly on mobile networks!",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "Professional, communicative, and technically gifted. Ali solved a database bottleneck we were struggling with for months in just two days.",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "Jenny",
        username: "@jenny",
        body: "The Gemini AI integration was perfect. Ali knows his stuff! He fine-tuned the prompts and the response time is incredibly fast.",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "James",
        username: "@james",
        body: "Best full-stack developer I've worked with on Upwork. The code quality is top-notch and the documentation is very clear. A++",
        img: "https://avatar.vercel.sh/james",
    },
];