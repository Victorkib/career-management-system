'use client';

import { useState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Tabs,
  Tag,
  Space,
  List,
  Progress,
  Statistic,
  Breadcrumb,
  Divider,
  Collapse,
  Badge,
  Tooltip,
  message,
  Avatar,
  Modal,
  Spin,
} from 'antd';
import {
  BookOutlined,
  BookFilled,
  ShareAltOutlined,
  DownloadOutlined, // Changed from PrinterOutlined to DownloadOutlined
  ArrowLeftOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  StarOutlined,
  TeamOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileTextOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  School,
  CheckCircle,
  DollarSign,
  User,
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Removed useLocation
import { useQuery } from '@tanstack/react-query';
import { getCareerDetails } from '../../services/recommendationService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const CareerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State for saved status
  const [isSaved, setIsSaved] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch career details from API. The backend will now include match/reasons if applicable.
  const {
    data: career,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['careerDetails', id],
    queryFn: () => getCareerDetails(id),
  });

  // Handle save career
  const handleSaveCareer = () => {
    setIsSaved(!isSaved);
    messageApi.success({
      content: isSaved
        ? 'Removed from saved careers'
        : 'Added to saved careers',
      duration: 2,
    });
  };

  // Handle share career
  const handleShareCareer = () => {
    messageApi.info(
      'This feature would allow sharing this career via email or social media.'
    );
  };

  const handleDownloadCareer = () => {
    setDownloadModalVisible(true);
  };

  const downloadAsPDF = async () => {
    setDownloading(true);
    try {
      // Get current theme
      const isDarkMode = document.documentElement.classList.contains('dark');

      // Create professional PDF content with theme awareness
      const pdfContent = generateProfessionalPDFContent(career, isDarkMode);

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${career.title.replace(
        /\s+/g,
        '_'
      )}_Professional_Career_Guide.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      messageApi.success('Professional career guide downloaded successfully!');
      setDownloadModalVisible(false);
    } catch (error) {
      messageApi.error('Failed to download career guide');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsExcel = async () => {
    setDownloading(true);
    try {
      const excelContent = generateExcelContent(career);
      const blob = new Blob([excelContent], {
        type: 'application/vnd.ms-excel',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${career.title.replace(/\s+/g, '_')}_Career_Data.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      messageApi.success('Career data downloaded as Excel file!');
      setDownloadModalVisible(false);
    } catch (error) {
      messageApi.error('Failed to download Excel file');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsWord = async () => {
    setDownloading(true);
    try {
      const wordContent = generateWordContent(career);
      const blob = new Blob([wordContent], { type: 'application/msword' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${career.title.replace(/\s+/g, '_')}_Career_Guide.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      messageApi.success('Career guide downloaded as Word document!');
      setDownloadModalVisible(false);
    } catch (error) {
      messageApi.error('Failed to download Word document');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsText = async () => {
    setDownloading(true);
    try {
      const textContent = generateTextContent(career);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${career.title.replace(/\s+/g, '_')}_Career_Guide.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      messageApi.success('Career guide downloaded as text file!');
      setDownloadModalVisible(false);
    } catch (error) {
      messageApi.error('Failed to download text file');
    } finally {
      setDownloading(false);
    }
  };

  const generateProfessionalPDFContent = (career, isDarkMode = false) => {
    const theme = {
      bg: isDarkMode ? '#1f1f1f' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#333333',
      primary: isDarkMode ? '#4096ff' : '#1890ff',
      secondary: isDarkMode ? '#722ed1' : '#531dab',
      accent: isDarkMode ? '#13c2c2' : '#08979c',
      border: isDarkMode ? '#434343' : '#d9d9d9',
      cardBg: isDarkMode ? '#262626' : '#fafafa',
      headerBg: isDarkMode ? '#141414' : '#f0f9ff',
      successBg: isDarkMode ? '#162312' : '#f6ffed',
      warningBg: isDarkMode ? '#2b1d16' : '#fffbe6',
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <title>${career.title} - Professional Career Guide</title>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: ${theme.bg};
            color: ${theme.text};
            line-height: 1.7;
            font-size: 14px;
            margin: 0;
            padding: 40px;
            min-height: 100vh;
        }
        
        .document-container {
            max-width: 210mm;
            margin: 0 auto;
            background: ${theme.bg};
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, ${theme.primary}, ${
      theme.secondary
    });
            color: white;
            padding: 60px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 16px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
        }
        
        .header .subtitle {
            font-size: 18px;
            opacity: 0.95;
            font-weight: 300;
            letter-spacing: 1px;
            position: relative;
            z-index: 2;
        }
        
        .match-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 12px 24px;
            border-radius: 50px;
            margin-top: 20px;
            font-weight: 600;
            font-size: 16px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            position: relative;
            z-index: 2;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 50px;
            page-break-inside: avoid;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid ${theme.primary};
            position: relative;
        }
        
        .section-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, ${theme.primary}, ${
      theme.accent
    });
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        
        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 600;
            color: ${theme.primary};
            margin: 0;
        }
        
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 25px 0;
        }
        
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin: 25px 0;
        }
        
        .card {
            background: ${theme.cardBg};
            border: 1px solid ${theme.border};
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, ${theme.primary}, ${
      theme.accent
    });
        }
        
        .card h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: ${theme.primary};
        }
        
        .salary-card {
            text-align: center;
            background: ${theme.successBg};
            border: 2px solid ${theme.accent};
        }
        
        .salary-amount {
            font-size: 24px;
            font-weight: 700;
            color: ${theme.accent};
            margin: 10px 0;
        }
        
        .institution-card {
            border-left: 5px solid ${theme.secondary};
            background: ${theme.headerBg};
        }
        
        .career-level-card {
            border-left: 5px solid ${theme.primary};
            margin-bottom: 20px;
        }
        
        .career-level-title {
            font-size: 20px;
            font-weight: 600;
            color: ${theme.primary};
            margin-bottom: 10px;
        }
        
        .career-roles {
            background: rgba(24, 144, 255, 0.1);
            padding: 12px 16px;
            border-radius: 8px;
            margin: 15px 0;
            font-style: italic;
        }
        
        .list-enhanced {
            list-style: none;
            padding: 0;
        }
        
        .list-enhanced li {
            padding: 12px 0;
            border-bottom: 1px solid ${theme.border};
            position: relative;
            padding-left: 30px;
        }
        
        .list-enhanced li:before {
            content: '✓';
            position: absolute;
            left: 0;
            top: 12px;
            color: ${theme.accent};
            font-weight: bold;
            font-size: 16px;
        }
        
        .list-enhanced li:last-child {
            border-bottom: none;
        }
        
        .highlight-box {
            background: ${theme.warningBg};
            border: 1px solid ${theme.accent};
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            position: relative;
        }
        
        .highlight-box::before {
            content: '💡';
            position: absolute;
            top: -15px;
            left: 25px;
            background: ${theme.bg};
            padding: 5px 10px;
            border-radius: 50%;
            font-size: 20px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-item {
            text-align: center;
            padding: 20px;
            background: ${theme.cardBg};
            border-radius: 12px;
            border: 1px solid ${theme.border};
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: 700;
            color: ${theme.primary};
            display: block;
        }
        
        .stat-label {
            font-size: 12px;
            color: ${theme.text};
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 8px;
        }
        
        .footer {
            background: ${theme.cardBg};
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid ${theme.border};
            color: ${theme.text};
            opacity: 0.7;
        }
        
        .footer-logo {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 600;
            color: ${theme.primary};
            margin-bottom: 10px;
        }
        
        @media print {
            body { margin: 0; padding: 0; }
            .document-container { box-shadow: none; }
            .section { page-break-inside: avoid; }
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: ${theme.border};
            border-radius: 4px;
            overflow: hidden;
            margin: 15px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, ${theme.primary}, ${
      theme.accent
    });
            border-radius: 4px;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="document-container">
        <div class="header">
            <h1>${career.title}</h1>
            <div class="subtitle">${
              career.category
            } • Professional Career Guide</div>
            ${
              career.match
                ? `<div class="match-badge">🎯 ${career.match}% Match Score</div>`
                : ''
            }
        </div>

        <div class="content">
            <div class="section">
                <div class="section-header">
                    <div class="section-icon">📋</div>
                    <h2 class="section-title">Career Overview</h2>
                </div>
                
                <div class="highlight-box">
                    <p style="font-size: 16px; line-height: 1.8; margin: 0;">${
                      career.description
                    }</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">${
                          career.minimumMeanGrade
                        }</span>
                        <div class="stat-label">Min Grade</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${
                          career.programDuration || '4 Years'
                        }</span>
                        <div class="stat-label">Duration</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${career.marketDemand}</span>
                        <div class="stat-label">Market Demand</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${
                          career.institutions?.length || 0
                        }</span>
                        <div class="stat-label">Institutions</div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="card">
                        <h3>🎯 Key Subjects</h3>
                        <ul class="list-enhanced">
                            ${
                              career.keySubjects
                                ?.map((subject) => `<li>${subject}</li>`)
                                .join('') || '<li>No subjects listed</li>'
                            }
                        </ul>
                    </div>
                    
                    <div class="card">
                        <h3>💼 Job Prospects</h3>
                        <ul class="list-enhanced">
                            ${
                              career.jobProspects
                                ?.map((job) => `<li>${job}</li>`)
                                .join('') || '<li>No prospects listed</li>'
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <div class="section-icon">💰</div>
                    <h2 class="section-title">Salary Expectations</h2>
                </div>
                
                <div class="grid-3">
                    <div class="card salary-card">
                        <h3>Entry Level</h3>
                        <div class="salary-amount">${
                          career.salary?.entry || 'N/A'
                        }</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 30%;"></div>
                        </div>
                    </div>
                    <div class="card salary-card">
                        <h3>Mid-Career</h3>
                        <div class="salary-amount">${
                          career.salary?.mid || 'N/A'
                        }</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 65%;"></div>
                        </div>
                    </div>
                    <div class="card salary-card">
                        <h3>Senior Level</h3>
                        <div class="salary-amount">${
                          career.salary?.senior || 'N/A'
                        }</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 100%;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <div class="section-icon">🎓</div>
                    <h2 class="section-title">Education & Institutions</h2>
                </div>
                
                <div class="highlight-box">
                    <h3 style="margin-bottom: 15px;">📚 Entry Requirements</h3>
                    <ul class="list-enhanced">
                        <li>Minimum mean grade of <strong>${
                          career.minimumMeanGrade
                        }</strong> in KCSE</li>
                        <li>Strong performance in key subjects: ${career.keySubjects?.join(
                          ', '
                        )}</li>
                        <li>Valid KCSE Certificate</li>
                        <li>Program Duration: ${
                          career.programDuration || '4 Years'
                        }</li>
                    </ul>
                </div>

                <h3 style="margin: 30px 0 20px 0; color: ${
                  theme.primary
                };">🏛️ Recommended Institutions</h3>
                <div class="grid-2">
                    ${
                      career.institutions
                        ?.map(
                          (institution) => `
                        <div class="card institution-card">
                            <h3>${institution.name}</h3>
                            <p><strong>📍 Location:</strong> ${
                              institution.location?.city
                            }, ${institution.location?.country}</p>
                            ${
                              institution.website
                                ? `<p><strong>🌐 Website:</strong> ${institution.website}</p>`
                                : ''
                            }
                            ${
                              institution.programs?.length
                                ? `<p><strong>📚 Programs:</strong> ${institution.programs.length} available</p>`
                                : ''
                            }
                        </div>
                    `
                        )
                        .join('') ||
                      '<div class="card"><p>No institutions listed</p></div>'
                    }
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <div class="section-icon">📈</div>
                    <h2 class="section-title">Career Progression Path</h2>
                </div>
                
                ${
                  career.careerPath?.entryLevel
                    ? `
                    <div class="career-level-card card">
                        <div class="career-level-title">🚀 Entry Level (${
                          career.careerPath.entryLevel.experience
                        })</div>
                        <div class="career-roles">Typical Roles: ${career.careerPath.entryLevel.roles?.join(
                          ', '
                        )}</div>
                        <p>${career.careerPath.entryLevel.description}</p>
                    </div>
                `
                    : ''
                }

                ${
                  career.careerPath?.midLevel
                    ? `
                    <div class="career-level-card card">
                        <div class="career-level-title">⭐ Mid-Level (${
                          career.careerPath.midLevel.experience
                        })</div>
                        <div class="career-roles">Typical Roles: ${career.careerPath.midLevel.roles?.join(
                          ', '
                        )}</div>
                        <p>${career.careerPath.midLevel.description}</p>
                    </div>
                `
                    : ''
                }

                ${
                  career.careerPath?.seniorLevel
                    ? `
                    <div class="career-level-card card">
                        <div class="career-level-title">🏆 Senior Level (${
                          career.careerPath.seniorLevel.experience
                        })</div>
                        <div class="career-roles">Typical Roles: ${career.careerPath.seniorLevel.roles?.join(
                          ', '
                        )}</div>
                        <p>${career.careerPath.seniorLevel.description}</p>
                    </div>
                `
                    : ''
                }

                ${
                  career.careerPath?.executiveLevel
                    ? `
                    <div class="career-level-card card">
                        <div class="career-level-title">👑 Executive Level (${
                          career.careerPath.executiveLevel.experience
                        })</div>
                        <div class="career-roles">Typical Roles: ${career.careerPath.executiveLevel.roles?.join(
                          ', '
                        )}</div>
                        <p>${career.careerPath.executiveLevel.description}</p>
                    </div>
                `
                    : ''
                }
            </div>

            <div class="section">
                <div class="section-header">
                    <div class="section-icon">🛠️</div>
                    <h2 class="section-title">Required Skills</h2>
                </div>
                
                <div class="card">
                    <ul class="list-enhanced">
                        ${
                          career.skillsRequired
                            ?.map((skill) => `<li>${skill}</li>`)
                            .join('') || '<li>No skills listed</li>'
                        }
                    </ul>
                </div>
            </div>

            ${
              career.match
                ? `
                <div class="section">
                    <div class="section-header">
                        <div class="section-icon">🎯</div>
                        <h2 class="section-title">Why This Career Matches You</h2>
                    </div>
                    
                    <div class="highlight-box">
                        <ul class="list-enhanced">
                            ${
                              career.reasons
                                ?.map((reason) => `<li>${reason}</li>`)
                                .join('') || '<li>No reasons listed</li>'
                            }
                        </ul>
                    </div>
                </div>
            `
                : ''
            }
        </div>

        <div class="footer">
            <div class="footer-logo">Career Guidance System</div>
            <p>Professional Career Guide • Generated on ${new Date().toLocaleDateString(
              'en-US',
              {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}</p>
            <p style="margin-top: 10px; font-size: 12px;">This document contains comprehensive career information to guide your professional journey.</p>
        </div>
    </div>
</body>
</html>`;
  };

  const generateWordContent = (career) => {
    return `
${career.title} - Career Guide
${'='.repeat(50)}

Category: ${career.category}
${career.match ? `Match Score: ${career.match}%` : ''}

Description:
${career.description}

OVERVIEW
--------

Key Subjects:
${career.keySubjects?.map((subject) => `• ${subject}`).join('\n') || ''}

Job Prospects:
${career.jobProspects?.map((job) => `• ${job}`).join('\n') || ''}

Salary Expectations:
• Entry Level: ${career.salary?.entry || 'N/A'}
• Mid-Career: ${career.salary?.mid || 'N/A'}
• Senior Level: ${career.salary?.senior || 'N/A'}

Market Demand: ${career.marketDemand}

EDUCATION REQUIREMENTS
---------------------

Minimum Entry Requirements:
• Minimum mean grade of ${career.minimumMeanGrade} in KCSE
• Strong performance in key subjects like ${career.keySubjects?.join(', ')}
• KCSE Certificate

Program Duration:
• Bachelor's Degree: ${career.programDuration}

Recommended Institutions:
${
  career.institutions
    ?.map(
      (institution) => `
• ${institution.name}
  Location: ${institution.location?.city}, ${institution.location?.country}
  ${institution.website ? `Website: ${institution.website}` : ''}
`
    )
    .join('\n') || 'No institutions listed'
}

CAREER PROGRESSION
-----------------

${
  career.careerPath?.entryLevel
    ? `
Entry Level (${career.careerPath.entryLevel.experience}):
Typical Roles: ${career.careerPath.entryLevel.roles?.join(', ')}
${career.careerPath.entryLevel.description}
`
    : ''
}

${
  career.careerPath?.midLevel
    ? `
Mid-Level (${career.careerPath.midLevel.experience}):
Typical Roles: ${career.careerPath.midLevel.roles?.join(', ')}
${career.careerPath.midLevel.description}
`
    : ''
}

${
  career.careerPath?.seniorLevel
    ? `
Senior Level (${career.careerPath.seniorLevel.experience}):
Typical Roles: ${career.careerPath.seniorLevel.roles?.join(', ')}
${career.careerPath.seniorLevel.description}
`
    : ''
}

${
  career.careerPath?.executiveLevel
    ? `
Executive Level (${career.careerPath.executiveLevel.experience}):
Typical Roles: ${career.careerPath.executiveLevel.roles?.join(', ')}
${career.careerPath.executiveLevel.description}
`
    : ''
}

REQUIRED SKILLS
--------------
${career.skillsRequired?.map((skill) => `• ${skill}`).join('\n') || ''}

${
  career.match
    ? `
WHY THIS CAREER MATCHES YOU
--------------------------
${career.reasons?.map((reason) => `• ${reason}`).join('\n') || ''}
`
    : ''
}

Generated on ${new Date().toLocaleDateString()} | Career Guidance System
`;
  };

  const generateTextContent = (career) => {
    return `${career.title} - Career Guide

Category: ${career.category}
${career.match ? `Match Score: ${career.match}%` : ''}

Description:
${career.description}

OVERVIEW
========

Key Subjects:
${career.keySubjects?.map((subject) => `- ${subject}`).join('\n') || ''}

Job Prospects:
${career.jobProspects?.map((job) => `- ${job}`).join('\n') || ''}

Salary Expectations:
- Entry Level: ${career.salary?.entry || 'N/A'}
- Mid-Career: ${career.salary?.mid || 'N/A'}
- Senior Level: ${career.salary?.senior || 'N/A'}

Market Demand: ${career.marketDemand}

EDUCATION REQUIREMENTS
=====================

Minimum Entry Requirements:
- Minimum mean grade of ${career.minimumMeanGrade} in KCSE
- Strong performance in key subjects like ${career.keySubjects?.join(', ')}
- KCSE Certificate

Program Duration:
- Bachelor's Degree: ${career.programDuration}

Recommended Institutions:
${
  career.institutions
    ?.map(
      (institution) => `
- ${institution.name}
  Location: ${institution.location?.city}, ${institution.location?.country}
  ${institution.website ? `Website: ${institution.website}` : ''}
`
    )
    .join('\n') || 'No institutions listed'
}

CAREER PROGRESSION
==================

${
  career.careerPath?.entryLevel
    ? `
Entry Level (${career.careerPath.entryLevel.experience}):
Typical Roles: ${career.careerPath.entryLevel.roles?.join(', ')}
${career.careerPath.entryLevel.description}
`
    : ''
}

${
  career.careerPath?.midLevel
    ? `
Mid-Level (${career.careerPath.midLevel.experience}):
Typical Roles: ${career.careerPath.midLevel.roles?.join(', ')}
${career.careerPath.midLevel.description}
`
    : ''
}

${
  career.careerPath?.seniorLevel
    ? `
Senior Level (${career.careerPath.seniorLevel.experience}):
Typical Roles: ${career.careerPath.seniorLevel.roles?.join(', ')}
${career.careerPath.seniorLevel.description}
`
    : ''
}

${
  career.careerPath?.executiveLevel
    ? `
Executive Level (${career.careerPath.executiveLevel.experience}):
Typical Roles: ${career.careerPath.executiveLevel.roles?.join(', ')}
${career.careerPath.executiveLevel.description}
`
    : ''
}

REQUIRED SKILLS
===============
${career.skillsRequired?.map((skill) => `- ${skill}`).join('\n') || ''}

${
  career.match
    ? `
WHY THIS CAREER MATCHES YOU
===========================
${career.reasons?.map((reason) => `- ${reason}`).join('\n') || ''}
`
    : ''
}

Generated on ${new Date().toLocaleDateString()} | Career Guidance System
`;
  };

  const generateExcelContent = (career) => {
    return `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="ProgId" content="Excel.Sheet">
    <meta name="Generator" content="Microsoft Excel 15">
    <style>
        .header { background-color: #1890ff; color: white; font-weight: bold; text-align: center; }
        .subheader { background-color: #f0f9ff; font-weight: bold; }
        .data { border: 1px solid #d9d9d9; }
    </style>
</head>
<body>
    <table border="1">
        <tr class="header">
            <td colspan="2">${career.title} - Career Data</td>
        </tr>
        <tr class="subheader">
            <td>Field</td>
            <td>Value</td>
        </tr>
        <tr class="data">
            <td>Career Title</td>
            <td>${career.title}</td>
        </tr>
        <tr class="data">
            <td>Category</td>
            <td>${career.category}</td>
        </tr>
        <tr class="data">
            <td>Minimum Mean Grade</td>
            <td>${career.minimumMeanGrade}</td>
        </tr>
        <tr class="data">
            <td>Program Duration</td>
            <td>${career.programDuration || '4 Years'}</td>
        </tr>
        <tr class="data">
            <td>Market Demand</td>
            <td>${career.marketDemand}</td>
        </tr>
        <tr class="data">
            <td>Entry Level Salary</td>
            <td>${career.salary?.entry || 'N/A'}</td>
        </tr>
        <tr class="data">
            <td>Mid-Career Salary</td>
            <td>${career.salary?.mid || 'N/A'}</td>
        </tr>
        <tr class="data">
            <td>Senior Level Salary</td>
            <td>${career.salary?.senior || 'N/A'}</td>
        </tr>
        ${
          career.match
            ? `
        <tr class="data">
            <td>Match Score</td>
            <td>${career.match}%</td>
        </tr>
        `
            : ''
        }
        <tr class="subheader">
            <td colspan="2">Key Subjects</td>
        </tr>
        ${
          career.keySubjects
            ?.map(
              (subject, index) => `
        <tr class="data">
            <td>Subject ${index + 1}</td>
            <td>${subject}</td>
        </tr>
        `
            )
            .join('') || ''
        }
        <tr class="subheader">
            <td colspan="2">Job Prospects</td>
        </tr>
        ${
          career.jobProspects
            ?.map(
              (job, index) => `
        <tr class="data">
            <td>Prospect ${index + 1}</td>
            <td>${job}</td>
        </tr>
        `
            )
            .join('') || ''
        }
        <tr class="subheader">
            <td colspan="2">Required Skills</td>
        </tr>
        ${
          career.skillsRequired
            ?.map(
              (skill, index) => `
        <tr class="data">
            <td>Skill ${index + 1}</td>
            <td>${skill}</td>
        </tr>
        `
            )
            .join('') || ''
        }
        <tr class="subheader">
            <td colspan="2">Institutions</td>
        </tr>
        ${
          career.institutions
            ?.map(
              (institution, index) => `
        <tr class="data">
            <td>Institution ${index + 1}</td>
            <td>${institution.name} - ${institution.location?.city}, ${
                institution.location?.country
              }</td>
        </tr>
        `
            )
            .join('') || ''
        }
    </table>
</body>
</html>`;
  };

  // Determine match color
  const getMatchColor = (match) => {
    if (match >= 90) return 'green';
    if (match >= 75) return 'blue';
    if (match >= 60) return 'orange';
    return 'red';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Card>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <Text>Loading career details...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <Card className="text-center py-10">
          <Title level={3} className="mb-4">
            Career Not Found
          </Title>
          <Paragraph className="mb-6">
            We couldn't find the career you're looking for.
          </Paragraph>
          <Button type="primary">
            <Link to="/recommendations">Back to Recommendations</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Define tab items using the new recommended format
  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <InfoCircleOutlined /> Overview
        </span>
      ),
      children: (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Title level={4}>Key Subjects</Title>
              <List
                dataSource={career.keySubjects}
                renderItem={(subject) => (
                  <List.Item>
                    <Space>
                      <CheckCircle size={16} className="text-green-500" />
                      <Text>{subject}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>

            <Col xs={24} md={12}>
              <Title level={4}>Job Prospects</Title>
              <List
                dataSource={career.jobProspects}
                renderItem={(job) => (
                  <List.Item>
                    <Space>
                      <Briefcase size={16} className="text-blue-500" />
                      <Text>{job}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Salary Expectations</Title>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} md={8}>
              <Card>
                <Space>
                  <Avatar
                    icon={<User size={24} />}
                    style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}
                  />
                  <div>
                    <Text type="secondary">Entry Level</Text>
                    <div>
                      <Text strong>{career.salary?.entry}</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Space>
                  <Avatar
                    icon={<Briefcase size={24} />}
                    style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                  />
                  <div>
                    <Text type="secondary">Mid-Career</Text>
                    <div>
                      <Text strong>{career.salary?.mid}</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Space>
                  <Avatar
                    icon={<DollarSign size={24} />}
                    style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}
                  />
                  <div>
                    <Text type="secondary">Senior Level</Text>
                    <div>
                      <Text strong>{career.salary?.senior}</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Title level={4}>Market Demand</Title>
          <Card>
            <Space align="start">
              <Avatar
                icon={<TrendingUp size={24} />}
                style={{
                  backgroundColor:
                    career.marketDemand === 'Very High'
                      ? '#f6ffed'
                      : career.marketDemand === 'High'
                      ? '#e6f7ff'
                      : career.marketDemand === 'Medium'
                      ? '#fff7e6'
                      : '#fff1f0',
                  color:
                    career.marketDemand === 'Very High'
                      ? '#52c41a'
                      : career.marketDemand === 'High'
                      ? '#1890ff'
                      : career.marketDemand === 'Medium'
                      ? '#fa8c16'
                      : '#f5222d',
                }}
                size={48}
              />
              <div>
                <Title level={5} className="mb-0">
                  {career.marketDemand}
                </Title>
                <Text type="secondary">Current market demand in Kenya</Text>
              </div>
            </Space>
            <Divider />
            <Paragraph>
              The job market for {career.title} in Kenya is currently
              experiencing {career.marketDemand?.toLowerCase()} demand.
              Graduates in this field can expect good employment opportunities
              in both the public and private sectors.
            </Paragraph>
          </Card>
        </>
      ),
    },
    {
      key: 'education',
      label: (
        <span>
          <GraduationCap size={16} /> Education
        </span>
      ),
      children: (
        <>
          <Title level={4}>Recommended Institutions</Title>
          <Row gutter={[16, 16]} className="mb-6">
            {career.institutions?.map((institution) => (
              <Col xs={24} md={12} key={institution.id}>
                <Card hoverable>
                  <Space>
                    <Avatar
                      src={
                        institution.logo && institution.logo !== ''
                          ? institution.logo
                          : undefined
                      } // Use institution logo if available and not empty
                      icon={
                        !institution.logo || institution.logo === '' ? (
                          <School size={24} />
                        ) : undefined
                      }
                      style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                      size={48}
                    />
                    <div>
                      <Text strong>{institution.name}</Text>
                      <div>
                        <Space>
                          <EnvironmentOutlined className="text-gray-500" />
                          <Text type="secondary">
                            {institution.location?.city},{' '}
                            {institution.location?.country}
                          </Text>
                        </Space>
                      </div>
                    </div>
                  </Space>
                  {institution.website && (
                    <Button
                      type="link"
                      icon={<LinkOutlined />}
                      className="mt-4 w-full"
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </Button>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          <Title level={4}>Education Requirements</Title>
          <Collapse className="mb-6">
            <Panel header="Minimum Entry Requirements" key="1">
              <List
                dataSource={[
                  `Minimum mean grade of ${career.minimumMeanGrade} in KCSE`,
                  `Strong performance in key subjects like ${career.keySubjects?.join(
                    ', '
                  )}`,
                  'KCSE Certificate',
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CheckCircleOutlined className="text-green-500" />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Program Duration" key="2">
              <List
                dataSource={[
                  `Bachelor's Degree: ${career.programDuration}`,
                  // Add more specific program durations if available in career data
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <ClockCircleOutlined className="text-blue-500" />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Alternative Pathways" key="3">
              <Paragraph>
                If you don't meet the direct entry requirements, consider these
                alternative pathways:
              </Paragraph>
              <List
                dataSource={[
                  'Diploma courses in related fields',
                  'Certificate courses with progression to diploma',
                  'Bridging courses for specific subjects',
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <RightOutlined className="text-blue-500" />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>

          <Title level={4}>Scholarships & Funding</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card>
                <Title level={5}>Higher Education Loans Board (HELB)</Title>
                <Space className="mb-2">
                  <CalendarOutlined className="text-gray-500" />
                  <Text type="secondary">Applications open annually</Text>
                </Space>
                <Paragraph>
                  Government loans and bursaries for Kenyan students pursuing
                  higher education.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Title level={5}>University Scholarships</Title>
                <Space className="mb-2">
                  <CalendarOutlined className="text-gray-500" />
                  <Text type="secondary">Varies by institution</Text>
                </Space>
                <Paragraph>
                  Merit-based scholarships offered by individual universities
                  for outstanding students.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: 'career',
      label: (
        <span>
          <Briefcase size={16} /> Career Path
        </span>
      ),
      children: (
        <>
          <Title level={4}>Career Progression</Title>
          <Row gutter={[16, 16]} className="mb-6">
            {career.careerPath?.entryLevel && (
              <Col xs={24}>
                <Card
                  title="Entry Level"
                  extra={
                    <Badge
                      count={career.careerPath.entryLevel.experience}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.entryLevel.roles?.map(
                        (role, index) => (
                          <Tag key={index} className="mr-2 mb-2">
                            {role}
                          </Tag>
                        )
                      )}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.entryLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
            {career.careerPath?.midLevel && (
              <Col xs={24}>
                <Card
                  title="Mid-Level"
                  extra={
                    <Badge
                      count={career.careerPath.midLevel.experience}
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.midLevel.roles?.map((role, index) => (
                        <Tag key={index} className="mr-2 mb-2">
                          {role}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.midLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
            {career.careerPath?.seniorLevel && (
              <Col xs={24}>
                <Card
                  title="Senior Level"
                  extra={
                    <Badge
                      count={career.careerPath.seniorLevel.experience}
                      style={{ backgroundColor: '#722ed1' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.seniorLevel.roles?.map(
                        (role, index) => (
                          <Tag key={index} className="mr-2 mb-2">
                            {role}
                          </Tag>
                        )
                      )}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.seniorLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
            {career.careerPath?.executiveLevel && (
              <Col xs={24}>
                <Card
                  title="Executive Level"
                  extra={
                    <Badge
                      count={career.careerPath.executiveLevel.experience}
                      style={{ backgroundColor: '#fa8c16' }}
                    />
                  }
                >
                  <div className="mb-3">
                    <Text strong>Typical Roles:</Text>
                    <div>
                      {career.careerPath.executiveLevel.roles?.map(
                        (role, index) => (
                          <Tag key={index} className="mr-2 mb-2">
                            {role}
                          </Tag>
                        )
                      )}
                    </div>
                  </div>
                  <Paragraph>
                    {career.careerPath.executiveLevel.description}
                  </Paragraph>
                </Card>
              </Col>
            )}
          </Row>

          <Title level={4}>Required Skills</Title>
          <Row gutter={[24, 24]} className="mb-6">
            <Col xs={24}>
              <Card title="Key Skills">
                <List
                  dataSource={career.skillsRequired}
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        <CheckCircleOutlined className="text-green-500" />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Title level={4}>Professional Certifications</Title>
          <Row gutter={[16, 16]}>
            {career.certifications?.map((cert, index) => (
              <Col xs={24} md={12} key={index}>
                <Card>
                  <Title level={5}>{cert.name}</Title>
                  <Text type="secondary">{cert.provider}</Text>
                  <Paragraph className="mt-2">{cert.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ),
    },
    {
      key: 'market',
      label: (
        <span>
          <TrendingUp size={16} /> Job Market
        </span>
      ),
      children: (
        <>
          <Title level={4}>Industry Trends</Title>
          <Row gutter={[16, 16]} className="mb-6">
            {career.industryTrends?.map((trend, index) => (
              <Col xs={24} key={index}>
                <Card>
                  <Paragraph>{trend}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <Title level={4}>Top Employers</Title>
          <Row gutter={[16, 16]} className="mb-6">
            {[
              { name: 'Safaricom', industry: 'Telecommunications' },
              { name: 'Kenya Commercial Bank', industry: 'Banking' },
              { name: 'Microsoft Africa', industry: 'Technology' },
              { name: 'IBM Kenya', industry: 'Technology' },
              {
                name: 'United Nations',
                industry: 'International Organization',
              },
              { name: 'Equity Bank', industry: 'Banking' },
            ].map((employer, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card>
                  <Title level={5}>{employer.name}</Title>
                  <Text type="secondary">{employer.industry}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          <Title level={4}>Job Market Statistics</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Average Time to Employment"
                  value="3 months"
                  prefix={<ClockCircleOutlined />}
                />
                <Text type="secondary">
                  Average time for graduates to find employment
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Job Satisfaction"
                  value="85%"
                  prefix={<StarOutlined />}
                />
                <Text type="secondary">
                  Professionals reporting high job satisfaction
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Annual Job Growth"
                  value="15%"
                  prefix={<TrendingUp size={16} />}
                />
                <Text type="secondary">
                  Projected annual growth in job opportunities
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <Statistic
                  title="Work-Life Balance"
                  value="Good"
                  prefix={<TeamOutlined />}
                />
                <Text type="secondary">
                  Reported work-life balance in the industry
                </Text>
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {contextHolder}

      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/recommendations">Recommendations</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{career.title}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Career Header */}
      <Card className="mb-6">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Space className="mb-2">
              <Tag color="blue">{career.category}</Tag>
              {career.match !== undefined && ( // Conditionally display match tag
                <Tag color={getMatchColor(career.match)}>
                  {career.match}% Match
                </Tag>
              )}
            </Space>
            <Title level={2} className="mb-2">
              {career.title}
            </Title>
            <Paragraph className="text-gray-500">
              {career.description}
            </Paragraph>
          </Col>

          <Col xs={24} md={8} className="mt-4 md:mt-0 flex justify-end">
            <Space>
              <Tooltip title={isSaved ? 'Remove from saved' : 'Save career'}>
                <Button
                  icon={isSaved ? <BookFilled /> : <BookOutlined />}
                  onClick={handleSaveCareer}
                  type={isSaved ? 'primary' : 'default'}
                />
              </Tooltip>
              {/* <Tooltip title="Share career">
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={handleShareCareer}
                />
              </Tooltip> */}
              <Tooltip title="Download career guide">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadCareer}
                />
              </Tooltip>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/recommendations')}
              >
                Back
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Tabs defaultActiveKey="overview" items={tabItems} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" className="w-full" size="large">
            {career.match !== undefined ? ( // Conditionally display match score card
              <Card>
                <Title level={4}>Match Score</Title>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <Text>Overall Match</Text>
                    <Text
                      strong
                      style={{
                        color:
                          career.match >= 90
                            ? '#52c41a'
                            : career.match >= 75
                            ? '#1890ff'
                            : career.match >= 60
                            ? '#fa8c16'
                            : '#f5222d',
                      }}
                    >
                      {career.match}%
                    </Text>
                  </div>
                  <Progress
                    percent={career.match}
                    status="active"
                    strokeColor={
                      career.match >= 90
                        ? '#52c41a'
                        : career.match >= 75
                        ? '#1890ff'
                        : career.match >= 60
                        ? '#fa8c16'
                        : '#f5222d'
                    }
                  />
                </div>

                <Divider />

                <Title level={5}>Why this is a good match:</Title>
                <List
                  dataSource={career.reasons || []} // Use actual reasons from the career object, default to empty array
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        <CheckCircleOutlined className="text-green-500" />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            ) : (
              <Card className="text-center py-6">
                <Title level={4} className="mb-4">
                  Get Your Personalized Match!
                </Title>
                <Paragraph className="mb-6">
                  Want to know how well this career matches your academic
                  strengths? Get your personalized recommendations now!
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => navigate('/input-results')}
                >
                  Get Recommendations
                </Button>
              </Card>
            )}

            <Card>
              <Title level={4}>Quick Facts</Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: 'Education Level',
                    description: career.programDuration,
                    icon: (
                      <Avatar
                        icon={<GraduationCap size={16} />}
                        style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                      />
                    ),
                  },
                  {
                    title: 'Average Starting Salary',
                    description: career.salary?.entry,
                    icon: (
                      <Avatar
                        icon={<DollarSign size={16} />}
                        style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}
                      />
                    ),
                  },
                  {
                    title: 'Market Demand',
                    description: career.marketDemand,
                    icon: (
                      <Avatar
                        icon={<TrendingUp size={16} />}
                        style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}
                      />
                    ),
                  },
                  {
                    title: 'Top Institution',
                    description:
                      career.institutions && career.institutions.length > 0
                        ? career.institutions[0].name
                        : 'N/A',
                    icon: (
                      <Avatar
                        icon={<School size={16} />}
                        style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}
                      />
                    ),
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={item.icon}
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card>
              <Title level={4}>Similar Careers</Title>
              <List
                dataSource={[
                  { title: 'Software Engineering', match: 92 },
                  { title: 'Information Technology', match: 90 },
                  { title: 'Data Science', match: 85 },
                  { title: 'Cybersecurity', match: 82 },
                ]}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    actions={[
                      <Button type="link" size="small" key="view">
                        View
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <Tag color={getMatchColor(item.match)}>
                          {item.match}% Match
                        </Tag>
                      }
                    />
                  </List.Item>
                )}
              />
              <Button type="primary" block className="mt-4">
                <Link to="/recommendations">View All Recommendations</Link>
              </Button>
            </Card>
          </Space>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <DownloadOutlined />
            <span
              style={{
                background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
              }}
            >
              Download Professional Career Guide
            </span>
          </Space>
        }
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
        footer={null}
        width={600}
        className="download-modal"
      >
        <div className="py-6">
          <Paragraph
            className="mb-8 text-gray-600 text-center"
            style={{ fontSize: '16px' }}
          >
            Choose your preferred format to download the complete professional
            career guide for <strong>{career.title}</strong>
          </Paragraph>

          <Space direction="vertical" className="w-full" size="large">
            <Card
              hoverable
              className="cursor-pointer border-2 hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={downloadAsPDF}
              disabled={downloading}
              style={{ borderRadius: '16px' }}
            >
              <div className="flex items-center justify-between">
                <Space size="large">
                  <Avatar
                    icon={<FilePdfOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                      color: 'white',
                      border: '3px solid rgba(255, 77, 79, 0.2)',
                    }}
                    size={50}
                  />
                  <div>
                    <Text
                      strong
                      className="text-xl"
                      style={{ color: '#1f1f1f' }}
                    >
                      Professional PDF Guide
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        🎨 Theme-aware • 📊 Visual charts • 🏆 Professional
                        layout
                      </Text>
                    </div>
                  </div>
                </Space>
                {downloading ? (
                  <Spin size="small" />
                ) : (
                  <RightOutlined style={{ color: '#1890ff' }} />
                )}
              </div>
            </Card>

            <Card
              hoverable
              className="cursor-pointer border-2 hover:border-green-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={downloadAsExcel}
              disabled={downloading}
              style={{ borderRadius: '16px' }}
            >
              <div className="flex items-center justify-between">
                <Space size="large">
                  <Avatar
                    icon={<FileExcelOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                      color: 'white',
                      border: '3px solid rgba(82, 196, 26, 0.2)',
                    }}
                    size={50}
                  />
                  <div>
                    <Text
                      strong
                      className="text-xl"
                      style={{ color: '#1f1f1f' }}
                    >
                      Excel Data Sheet
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        📈 Structured data • 🔢 Easy analysis • 📊 Spreadsheet
                        format
                      </Text>
                    </div>
                  </div>
                </Space>
                {downloading ? (
                  <Spin size="small" />
                ) : (
                  <RightOutlined style={{ color: '#52c41a' }} />
                )}
              </div>
            </Card>

            <Card
              hoverable
              className="cursor-pointer border-2 hover:border-purple-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={downloadAsWord}
              disabled={downloading}
              style={{ borderRadius: '16px' }}
            >
              <div className="flex items-center justify-between">
                <Space size="large">
                  <Avatar
                    icon={<FileWordOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                      color: 'white',
                      border: '3px solid rgba(24, 144, 255, 0.2)',
                    }}
                    size={50}
                  />
                  <div>
                    <Text
                      strong
                      className="text-xl"
                      style={{ color: '#1f1f1f' }}
                    >
                      Editable Word Document
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        ✏️ Fully editable • 📝 Add personal notes • 💾 Save
                        changes
                      </Text>
                    </div>
                  </div>
                </Space>
                {downloading ? (
                  <Spin size="small" />
                ) : (
                  <RightOutlined style={{ color: '#1890ff' }} />
                )}
              </div>
            </Card>

            <Card
              hoverable
              className="cursor-pointer border-2 hover:border-orange-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={downloadAsText}
              disabled={downloading}
              style={{ borderRadius: '16px' }}
            >
              <div className="flex items-center justify-between">
                <Space size="large">
                  <Avatar
                    icon={<FileTextOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #fa8c16, #ffa940)',
                      color: 'white',
                      border: '3px solid rgba(250, 140, 22, 0.2)',
                    }}
                    size={50}
                  />
                  <div>
                    <Text
                      strong
                      className="text-xl"
                      style={{ color: '#1f1f1f' }}
                    >
                      Simple Text File
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        📄 Universal format • 🚀 Quick sharing • 💾 Lightweight
                      </Text>
                    </div>
                  </div>
                </Space>
                {downloading ? (
                  <Spin size="small" />
                ) : (
                  <RightOutlined style={{ color: '#fa8c16' }} />
                )}
              </div>
            </Card>
          </Space>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <Space align="start">
              <InfoCircleOutlined className="text-blue-500 text-lg mt-1" />
              <div>
                <Text strong className="text-blue-700 block mb-2">
                  ✨ Enhanced Download Features
                </Text>
                <Text type="secondary" className="text-sm leading-relaxed">
                  • <strong>Theme-aware styling</strong> adapts to your current
                  light/dark mode preference
                  <br />• <strong>Professional layouts</strong> with modern
                  typography and visual elements
                  <br />• <strong>Comprehensive data</strong> includes all
                  career information, progression paths, and institutions
                  <br />• <strong>Print-optimized</strong> formats perfect for
                  offline reference and sharing
                </Text>
              </div>
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CareerDetails;
