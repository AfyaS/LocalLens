# 🏛️ LocalLens

> **Empowering civic engagement through accessible technology**

LocalLens is a comprehensive civic engagement platform that connects citizens with their local government, community organizations, and civic opportunities. Built with accessibility and inclusivity at its core, the platform makes civic participation accessible to everyone, regardless of ability, language, or technical expertise.

![LocalLens](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Azure](https://img.shields.io/badge/Cloud-Azure-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Azure%20Functions-green)

## 🌟 Features

### 🎯 **Core Functionality**
- **Real-time Government Data**: Live integration with Massachusetts Legislature API
- **Civic Action Discovery**: Browse volunteer opportunities, public meetings, and community events
- **Accessibility First**: WCAG AAA compliant with screen reader support, high contrast mode, and dyslexia-friendly fonts
- **Multi-language Support**: Real-time translation for Spanish, Portuguese, Chinese, and Haitian Creole
- **User Authentication**: Secure registration and login with Azure SQL Database
- **Impact Tracking**: Personal dashboard showing civic engagement history and achievements

### 🏛️ **Government Integration**
- **MA Legislature Sync**: Automated sync of legislative hearings every 30 minutes
- **Public Meeting Notices**: 48+ hour notice compliance for Massachusetts Open Meeting Law
- **Committee Information**: Real-time data from Joint Committees, Senate, and House
- **Hearing Details**: Complete information including dates, locations, and agendas

### ♿ **Accessibility Features**
- **Screen Reader Compatible**: Full ARIA support and semantic HTML
- **High Contrast Mode**: WCAG AAA compliant color ratios
- **Dyslexia Support**: OpenDyslexic font option
- **Font Size Control**: Adjustable text sizing with persistence
- **Keyboard Navigation**: Complete keyboard accessibility
- **Voice Navigation**: Speech-to-text and voice commands (optional)

## 🏗️ Technical Architecture

### **Frontend Stack**
<<<<<<< HEAD
- **JavaScript/TypeScript** and **React 18** with JavaScript/TypeScript for type-safe development
=======
- **React 18** with TypeScript for type-safe development
>>>>>>> 095c6b9 (Initial commit: LocalLens - Civic Engagement Platform)
- **Vite** for lightning-fast build times and HMR
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **React Router** for client-side routing
- **React Hook Form** with Zod validation
- **TanStack Query** for server state management

### **Backend Infrastructure**
- **Azure Functions** (Node.js 22) for serverless API endpoints
- **Azure SQL Database** for persistent data storage
- **Azure Static Web Apps** for frontend hosting
- **Azure Cognitive Services** for real-time translation
- **Azure CDN** for global content delivery

### **Database Schema**
```sql
-- Core tables for civic engagement platform
users                    -- User accounts and authentication
user_profiles           -- Extended user information
civic_actions           -- Events, meetings, and opportunities
api_integrations        -- External API sync status
user_reputation         -- Civic engagement scoring
action_comments         -- Community discussions
```

### **API Integrations**
- **Massachusetts Legislature API**: Real-time legislative hearing data
- **Azure Cognitive Services Translator**: Multi-language support
- **Custom Azure Functions**: Authentication, data sync, and reporting

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- Azure CLI
- Git

### **Installation**

1. **Clone the repository**
   ```bash
<<<<<<< HEAD
   git clone https://github.com/AfyaS/community-clarity-ai.git
=======
   git clone https://github.com/your-username/community-clarity-ai.git
>>>>>>> 095c6b9 (Initial commit: LocalLens - Civic Engagement Platform)
   cd community-clarity-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   VITE_AZURE_FUNCTION_URL=https://your-function-app.azurewebsites.net/api
   VITE_AZURE_TRANSLATOR_KEY=your-translator-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### **Production Deployment**

The application is deployed on Azure with the following architecture:

- **Frontend**: Azure Static Web Apps
- **Backend**: Azure Functions (Node.js 22)
- **Database**: Azure SQL Database
- **Translation**: Azure Cognitive Services

## 📊 Data Sources

### **Government APIs**
- **Massachusetts Legislature**: Official legislative hearing data
- **Committee Information**: Joint, Senate, and House committee details
- **Public Meeting Notices**: Open Meeting Law compliant notices

### **Community Data**
- **Volunteer Opportunities**: Curated from local organizations
- **Public Events**: Government and community-sponsored events
- **Civic Actions**: User-generated civic engagement opportunities

## 🔐 Authentication & Security

### **User Management**
- **Azure SQL Database**: Secure user storage with bcrypt password hashing
- **JWT Tokens**: Stateless authentication for API access
- **CORS Configuration**: Properly configured for production security
- **Input Validation**: Zod schemas for all user inputs

### **Data Protection**
- **HTTPS Everywhere**: All communications encrypted
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: API endpoint protection

## 🌍 Accessibility & Inclusion

### **WCAG AAA Compliance**
- **Color Contrast**: Minimum 7:1 ratio for normal text
- **Screen Reader Support**: Complete ARIA implementation
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators and logical tab order

### **Multi-language Support**
- **Real-time Translation**: Azure Cognitive Services integration
- **Language Persistence**: User preferences saved across sessions
- **Cultural Adaptation**: Region-specific civic engagement patterns

## 📈 Performance & Monitoring

### **Performance Metrics**
- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Excellent LCP, FID, and CLS scores
- **Bundle Size**: Optimized with code splitting
- **CDN Delivery**: Global content distribution

### **Monitoring & Analytics**
- **Azure Application Insights**: Real-time performance monitoring
- **Error Tracking**: Comprehensive error logging and alerting
- **User Analytics**: Privacy-compliant usage tracking

## 🤝 Contributing

We welcome contributions to make civic engagement more accessible! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<<<<<<< HEAD
## 👨‍💻 Developer

**Afya Shaikh** - Full-stack developer and civic engagement advocate

This project was developed with the assistance of **ChatGPT** for code generation, architecture planning, and technical guidance throughout the development process.

=======
>>>>>>> 095c6b9 (Initial commit: LocalLens - Civic Engagement Platform)
## 🙏 Acknowledgments

- **Massachusetts Legislature** for providing open API access
- **Azure** for cloud infrastructure and services
- **OpenDyslexic** for dyslexia-friendly font support
- **Radix UI** for accessible component primitives
- **React Community** for the amazing ecosystem
<<<<<<< HEAD
- **ChatGPT** for AI-assisted development and technical guidance
=======
>>>>>>> 095c6b9 (Initial commit: LocalLens - Civic Engagement Platform)

## 📞 Support

- **Documentation**: [Full Documentation](https://docs.locallens.ai)
<<<<<<< HEAD
- **Issues**: [GitHub Issues](https://github.com/AfyaS/locallens/issues)
=======
- **Issues**: [GitHub Issues](https://github.com/your-username/locallens/issues)
- **Email**: support@locallens.ai
>>>>>>> 095c6b9 (Initial commit: LocalLens - Civic Engagement Platform)

## 🌟 Live Demo

**Production URL**: [https://brave-glacier-09303180f.1.azurestaticapps.net](https://brave-glacier-09303180f.1.azurestaticapps.net)

---

<div align="center">

<<<<<<< HEAD
**Built for civic engagement and accessibility**
=======
**Built with ❤️ for civic engagement and accessibility**
>>>>>>> 095c6b9 (Initial commit: LocalLens - Civic Engagement Platform)

[![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> 095c6b9 (Initial commit: LocalLens - Civic Engagement Platform)
