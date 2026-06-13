import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const RAW_URI = process.env.MONGODB_URI!

// URL-encode the password so special characters like [ ] work without
// changing the .env file (the Node MongoDB driver is strict about this).
function encodedURI(uri: string): string {
  try {
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+?)@(.+)$/)
    if (!match) return uri
    const [, proto, user, pass, rest] = match
    return `${proto}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${rest}`
  } catch {
    return uri
  }
}

const MONGODB_URI = encodedURI(RAW_URI)
const MONGODB_DB = process.env.MONGODB_DB || 'portfolio'

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
  console.log(`Connected to MongoDB → db: "${MONGODB_DB}"`)

  // Clear existing data
  await mongoose.connection.dropDatabase()

  // Skills
  const SkillModel = (await import('../models/Skill')).default
  await SkillModel.insertMany([
    // Languages
    { name: 'Python', category: 'Languages', level: 95, color: '#3776ab' },
    { name: 'JavaScript', category: 'Languages', level: 85, color: '#f7df1e' },
    { name: 'Java', category: 'Languages', level: 80, color: '#007396' },
    { name: 'SQL', category: 'Languages', level: 88, color: '#4479a1' },
    { name: 'C', category: 'Languages', level: 75, color: '#a8b9cc' },
    
    // Web Development
    { name: 'React.js', category: 'Web Dev', level: 88, color: '#61dafb' },
    { name: 'Next.js', category: 'Web Dev', level: 90, color: '#ffffff' },
    { name: 'Node.js', category: 'Web Dev', level: 85, color: '#339933' },
    { name: 'Express.js', category: 'Web Dev', level: 82, color: '#ffffff' },
    { name: 'Prisma', category: 'Web Dev', level: 80, color: '#2d3748' },
    
    // AI/ML
    { name: 'OpenCV', category: 'Computer Vision', level: 90, color: '#5c3ee8' },
    { name: 'TensorFlow', category: 'AI/ML', level: 88, color: '#ff6f00' },
    { name: 'PyTorch', category: 'AI/ML', level: 82, color: '#ee4c2c' },
    { name: 'YOLO', category: 'Computer Vision', level: 92, color: '#00fff0' },
    { name: 'Pandas', category: 'AI/ML', level: 95, color: '#150458' },
    { name: 'Scikit-learn', category: 'AI/ML', level: 90, color: '#f89939' },
    
    // Cloud & DevOps
    { name: 'AWS', category: 'Tools', level: 85, color: '#ff9900' },
    { name: 'Azure', category: 'Tools', level: 78, color: '#0089d6' },
    { name: 'CI/CD', category: 'Tools', level: 82, color: '#ffffff' },
    { name: 'Docker', category: 'Tools', level: 75, color: '#2496ed' },
    { name: 'Git / GitHub', category: 'Tools', level: 95, color: '#f05032' },
    
    // Robotics
    { name: 'Arduino', category: 'Robotics', level: 90, color: '#00979d' },
    { name: 'PID Control', category: 'Robotics', level: 85, color: '#ffffff' },
    { name: 'ESP8266', category: 'Robotics', level: 80, color: '#ffffff' },
  ])
  console.log('✅ Skills seeded')

  // Experience
  const ExpModel = (await import('../models/Experience')).default
  await ExpModel.insertMany([
    {
      title: 'B.Tech in Information Technology',
      organization: 'National Institute of Technology Srinagar',
      type: 'Education',
      startDate: '2023-08',
      current: true,
      location: 'Srinagar, India',
      description: 'Maintaining a 9.32/10.0 CGPA. Relevant Coursework: OOP, Databases, DSA, OS, Artificial Intelligence.',
      tags: ['Srinagar', 'NIT', 'IT'],
    },
    {
      title: 'Full Stack Web Development Intern',
      organization: 'ASPL Consultancy Pvt Ltd',
      type: 'Work',
      startDate: '2025-05',
      endDate: '2025-06',
      current: false,
      location: 'Remote',
      description: 'Contributed to building a full-stack application by developing features for the Next.js frontend and assisting with backend API creation. Architected and managed AWS infrastructure (EC2, S3, RDS) and set up a CI/CD pipeline, reducing deployment time by 70%.',
      tags: ['Next.js', 'AWS', 'CI/CD', 'Full Stack'],
    },
    {
      title: 'Machine Learning Intern',
      organization: 'NIT Kurukshetra',
      type: 'Work',
      startDate: '2024-12',
      endDate: '2025-02',
      current: false,
      location: 'Kurukshetra, India',
      description: "Developed and trained deep learning models for deepfake detection. Contributed to a published patent 'Systems and Methods for Detecting Manipulated Segments Within a Video Sequence'. Leveraged Python, TensorFlow, and Transformers on a Slurm-managed HPC cluster, improving training efficiency by 30%.",
      tags: ['ML', 'Deepfake Detection', 'Patent', 'HPC'],
    },
  ])
  console.log('✅ Experience seeded')

  // Focus Areas
  const FocusAreaModel = (await import('../models/FocusArea')).default
  await FocusAreaModel.insertMany([
    { title: 'Artificial Intelligence', description: 'Deep learning, transformers, LLMs', icon: 'brain', color: 'var(--cyan)', order: 0 },
    { title: 'Computer Vision', description: 'YOLO, OpenCV, image segmentation', icon: 'eye', color: 'var(--magenta)', order: 1 },
    { title: 'Web Development', description: 'React, Next.js, Node.js, APIs', icon: 'code', color: 'var(--green)', order: 2 },
    { title: 'Robotics', description: 'ROS, Arduino, sensor fusion', icon: 'robot', color: 'var(--yellow)', order: 3 },
  ])
  console.log('✅ Focus Areas seeded')

  // Projects
  const ProjectModel = (await import('../models/Project')).default
  await ProjectModel.insertMany([
    {
      title: 'Komodo CLI',
      description: 'Lightweight CLI tool to create and manage Python virtual environments on macOS.',
      longDescription: 'Developed a lightweight CLI tool to create and manage Python virtual environments on macOS, improving developer productivity and workflow automation.',
      tags: ['Python', 'CLI', 'macOS'],
      category: 'Other',
      github: 'https://github.com/AI-Alan',
      featured: true,
      techStack: ['Python (OS, Sys, Subprocess)', 'Zsh'],
    },
    {
      title: 'AI Agent - Tech Blog Writer',
      description: 'Agent that generates structured technical blog content using LLMs.',
      longDescription: 'Built an agent that generates structured technical blog content using LLMs, with prompt engineering and style templates for enterprise documentation.',
      tags: ['AI', 'LLM', 'Python'],
      category: 'AI',
      github: 'https://github.com/AI-Alan',
      featured: true,
      techStack: ['Python', 'Gemini APIs', 'Prompt Engineering'],
    },
    {
      title: 'AI Agent – Crypto Trading Automation',
      description: 'Automated cryptocurrency trading workflows with real-time decision support.',
      longDescription: 'Automated cryptocurrency trading workflows; currently tested via paper-trading. Focused on API integration, modular design, and real-time decision support.',
      tags: ['FinTech', 'AI', 'Crypto'],
      category: 'AI',
      github: 'https://github.com/AI-Alan',
      featured: true,
      techStack: ['Python', 'REST APIs', 'Gemini API'],
    },
    {
      title: 'Line Follower Robot',
      description: 'Autonomous robot based on PID algorithm using Arduino Uno.',
      longDescription: 'A Line Follower Robot based on the PID algorithm and using Arduino Uno, a 5-channel Line sensor, a motor driver, etc.',
      tags: ['Arduino', 'PID', 'Robotics'],
      category: 'Robotics',
      github: 'https://github.com/AI-Alan',
      featured: true,
      techStack: ['Arduino Uno', 'PID Algorithm', 'Sensors'],
    },
    {
      title: 'Custom Object Detection',
      description: 'YOLOv8 model to detect specific objects in real-time camera feeds.',
      longDescription: 'Created a custom object detection model using YOLOv8 to detect bottles in images or real-time camera feeds. Trained on a custom dataset.',
      tags: ['CV', 'YOLOv8', 'Python'],
      category: 'CV',
      github: 'https://github.com/AI-Alan',
      featured: true,
      techStack: ['Python', 'YOLOv8', 'OpenCV'],
    },
    {
      title: 'Bakery Management System',
      description: 'Terminal-based ordering and tracking system using Python and Pandas.',
      longDescription: 'A terminal-based Bakery Management System where users can sign up, sign in, make orders, and track order details using Python with libraries OS, Sys, and Pandas.',
      tags: ['Python', 'Pandas'],
      category: 'Other',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Python', 'OS', 'Sys', 'Pandas'],
    },
    {
      title: 'Smart Plant Watering System',
      description: 'Autonomous watering system based on environmental sensors.',
      longDescription: 'An autonomous plant watering system based on weather conditions using Arduino, DHT sensor, Raindrop sensor, and humidity sensor.',
      tags: ['Arduino', 'IoT', 'Sensors'],
      category: 'Robotics',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Arduino', 'DHT sensor', 'Raindrop sensor', 'Humidity sensor'],
    },
    {
      title: 'Body Parts Detection',
      description: 'Full Body and Body Parts detection using Haar cascade Classifiers.',
      longDescription: 'Made Full Body and Body Parts detection using a Pretrained Haar cascade Classifier and Python’s OpenCV Library.',
      tags: ['Python', 'OpenCV', 'CV'],
      category: 'CV',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Python', 'OpenCV'],
    },
    {
      title: 'RC Car',
      description: 'WiFi-controlled RC car with claws using Arduino and ESP8266.',
      longDescription: 'A four-wheeled, remotely controlled car over WiFi via smartphone, which has two claws using Arduino, ESP8266 (WiFi module), and Motor Driver (L298N).',
      tags: ['Arduino', 'ESP8266', 'IoT'],
      category: 'Robotics',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Arduino', 'ESP8266', 'L298N', 'C++'],
    },
    {
      title: 'Robo Car',
      description: 'Joystick-controlled four-wheeled robot using Arduino.',
      longDescription: 'A four-wheeled Robo Car controlled by a joystick using Arduino and Motor Drivers (L298N).',
      tags: ['Arduino', 'Robotics'],
      category: 'Robotics',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Arduino', 'L298N', 'C++'],
    },
    {
      title: 'Tic Tac Toe Game',
      description: 'GUI-based game with single-player and multiplayer modes.',
      tags: ['Python', 'GUI', 'Game'],
      category: 'Other',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Python', 'Tkinter'],
    },
    {
      title: 'IRIS Dataset Analysis',
      description: 'Preprocessing and KNN classification tasks on the IRIS dataset.',
      tags: ['ML', 'Data Science', 'Python'],
      category: 'ML',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Python', 'Scikit-learn', 'KNN', 'Pandas'],
    },
    {
      title: 'MNIST Digits Classification',
      description: 'Handwritten digit classification using SGD Classifier.',
      tags: ['ML', 'Computer Vision', 'Python'],
      category: 'ML',
      github: 'https://github.com/AI-Alan',
      featured: false,
      techStack: ['Python', 'SGD Classifier', 'Matplotlib'],
    },
  ])
  console.log('✅ Projects seeded')

  // Profile (single document)
  const ProfileModel = (await import('../models/Profile')).default
  await ProfileModel.deleteMany({})
  await ProfileModel.create({
    name: 'Aman Kumar Yadav',
    tagline: 'AI / ML Engineer & Intelligent Systems Developer',
    bio: "Passionate about the intersection of Artificial Intelligence, Machine Learning, and Computer Vision. Currently pursuing B.Tech at NIT Srinagar. Interned at ASPL Consultancy (Full Stack/Cloud) and NIT Kurukshetra (ML Research). Organizer of Python & AI/ML workshops and lead for robotics events at TECHVAGANZA.",
    email: '2023nitsgr241@nitsri.ac.in',
    github: 'https://github.com/AI-Alan',
    linkedin: 'https://linkedin.com/in/aman-kumar-yadav010',
    location: 'Srinagar, India',
    availableForWork: true,
    projectsCount: '13+',
    technologiesCount: '25+',
    yearOfStudy: '2nd Year',
    coffeeCups: '∞',
    heroTypingTexts: [
      'AI / ML Engineer',
      'Computer Vision Expert',
      'Robotics Developer',
      'Full-Stack Developer',
      'AWS Cloud Enthusiast',
    ],
  })
  console.log('✅ Profile seeded')

  const seedEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
  const seedPassword = process.env.SEED_ADMIN_PASSWORD
  if (seedEmail && seedPassword) {
    const AdminModel = (await import('../models/Admin')).default
    const { hashPassword } = await import('./password')
    const passwordHash = await hashPassword(seedPassword)
    await AdminModel.create({ email: seedEmail, passwordHash })
    console.log('✅ Admin seeded')
  } else {
    console.log('⚠️  Admin not seeded — run: npm run seed:admin (with SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD)')
  }

  console.log('\n🎉 Database seeded successfully!')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
