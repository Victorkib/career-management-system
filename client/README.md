# 🎯 Career Management System - Frontend

A comprehensive career guidance platform that helps students make informed career decisions based on their KCSE exam results using advanced machine learning algorithms.

## 🌟 Overview

The Career Management System is an intelligent platform designed to bridge the gap between academic performance and career choice. Our system analyzes students' KCSE results and provides personalized career recommendations using three sophisticated AI helpers:

- **Similar Student Finder**: Recommends careers based on what students with similar grades chose
- **Success Predictor**: Predicts the likelihood of success in specific career paths
- **Career Sorter**: Matches careers to appropriate academic performance levels

## ✨ Key Features

### 🎓 For Students
- **Personalized Career Recommendations**: Get career suggestions tailored to your KCSE results
- **Academic Performance Analysis**: Understand your strengths and areas for improvement
- **Career Tier Classification**: See careers organized by difficulty level (ELITE, PREMIUM, STANDARD, FOUNDATION)
- **Success Probability**: Know your chances of success in each recommended career
- **Interactive Career Explorer**: Browse careers with detailed information including salary, requirements, and job prospects

### 👨‍💼 For Administrators
- **Comprehensive Career Management**: Add, edit, and manage career database
- **User Analytics**: Track student engagement and recommendation effectiveness
- **Advanced Filtering & Search**: Powerful tools to manage large career datasets
- **Bulk Operations**: Import/export career data and manage multiple entries
- **Real-time Statistics**: Monitor system performance and user interactions

### 🏫 For Institutions
- **Institution Management**: Add and manage educational institutions
- **Program Mapping**: Link careers to specific institutions and programs
- **Student Progress Tracking**: Monitor student career exploration activities

## 🚀 Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **Vite** - Lightning-fast build tool and development server
- **Ant Design** - Professional UI component library
- **Tailwind CSS** - Utility-first CSS framework for custom styling
- **React Router** - Client-side routing for single-page application
- **React Query** - Data fetching and state management
- **Framer Motion** - Smooth animations and transitions

### Key Libraries
- **@tanstack/react-query** - Server state management
- **react-router-dom** - Navigation and routing
- **antd** - UI components
- **xlsx** - Excel file processing
- **jspdf** - PDF generation
- **react-csv** - CSV export functionality

## 🎨 User Interface

### Modern Design
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: User preference-based theme switching
- **Intuitive Navigation**: Clean and organized user interface
- **Accessibility**: WCAG compliant design for inclusive access

### Key Pages
- **Dashboard**: Overview of recommendations and career insights
- **Career Explorer**: Browse and search careers with advanced filters
- **Recommendations**: Personalized career suggestions with detailed explanations
- **Profile Management**: User settings and KCSE results input
- **Admin Panel**: Comprehensive management interface for administrators

## 🔧 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-management-system/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 📊 System Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── v1/             # Legacy components
│   ├── v2/             # Current version components
│   │   ├── admin/      # Admin-specific components
│   │   ├── common/     # Shared components
│   │   └── ...
├── pages/              # Page components
│   ├── v1/             # Legacy pages
│   ├── v2/             # Current version pages
│   │   ├── admin/      # Admin pages
│   │   └── ...
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── utils/              # Utility functions
└── ui/                 # UI component library
```

### State Management
- **React Context**: Global state for authentication and theme
- **React Query**: Server state and caching
- **Local State**: Component-level state with useState/useReducer

## 🔗 API Integration

The frontend communicates with a Node.js backend that provides:
- **RESTful APIs** for career and user management
- **Machine Learning Services** for personalized recommendations
- **Authentication & Authorization** with JWT tokens
- **File Upload** capabilities for images and documents

## 🎯 Key Features in Detail

### Career Recommendation Engine
- **Multi-factor Analysis**: Combines academic performance, subject strengths, and career requirements
- **Real-time Processing**: Instant recommendations based on KCSE input
- **Confidence Scoring**: Each recommendation includes a confidence percentage
- **Explanation System**: Clear reasons why each career is recommended

### Advanced Search & Filtering
- **Multi-criteria Search**: Filter by category, salary range, requirements, and more
- **Smart Pagination**: Efficient handling of large career datasets
- **Sorting Options**: Multiple sorting criteria for better user experience
- **Saved Searches**: Users can save and revisit their search preferences

### Data Management
- **Bulk Operations**: Import/export career data in Excel/CSV formats
- **Data Validation**: Comprehensive validation for data integrity
- **Version Control**: Track changes and maintain data history
- **Backup & Recovery**: Automated backup systems for data safety

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Career Management System
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔮 Future Enhancements

- **Mobile App**: Native mobile applications for iOS and Android
- **Advanced Analytics**: More detailed insights and reporting
- **Integration APIs**: Connect with external career databases
- **AI Chatbot**: Interactive career guidance assistant
- **Video Content**: Career exploration videos and interviews

---

**Built with ❤️ for students seeking their perfect career path**