import express from 'express'
import authRouter from './controllers/auth.js';
import authMiddleware from './middlewares/auth.js'
import User from './models/user.js';
import { dbSync } from './services/database.js';
import BookOneRouter from './controllers/BookOneController.js'
import CourseRouter from './controllers/CourseController.js';
import { findExistingCourseByUserId } from './services/CourseService.js';
import cors from 'cors';
import chatbotRouter from './controllers/chatbot.js';

const app = express();

// CORS: allow browser clients (prod + local dev, including forwarded IDE ports)
const corsOrigins: cors.CorsOptions['origin'] =
  process.env.NODE_ENV === 'development'
    ? [/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/]
    : [
        /^https:\/\/.*\.ext\.ocp-prod-0\.k8s\.it\.helsinki\.fi$/,
        'http://localhost:5173',
      ];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'DPoP'],
}));
app.use(express.json());
app.use('/auth', authRouter);
app.use('/chatbot', authMiddleware, chatbotRouter)
app.use('/bookones', authMiddleware, BookOneRouter);
app.get('/course/share/:userid', async (req, res) => {
  try {
    const course = await findExistingCourseByUserId(req.params.userid);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.json(course);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An unknown error occurred' });
  }
});
app.use('/course', authMiddleware, CourseRouter);

app.get('/me', authMiddleware, async (req, res) => {
  const user: User | null = await User.findOne({
    where: {
      id: req.user?.id
    }
  });
  console.log(user)
  res.json(user);
});

app.get('/', authMiddleware, async (_, res) => {
  res.status(200).send('Success');
});

const PORT = Number(process.env.PORT) || 8080

dbSync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to sync the database:', error);
  process.exit(1);
});



