import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ContactForm } from './ui/contact-form';
import { DarkModeToggle } from './ui/dark-mode-toggle';
import { MobileNav } from './ui/mobile-nav';
import {
  DashboardPreview,
  ECommercePreview,
  TaskManagementPreview,
  WeatherDashboardPreview
} from './ui/project-previews';
import { SkillsSection } from './ui/skill-bar';

export function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Kevin Tong</span>
          </div>
          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#about"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Skills
            </a>
            <a
              href="#projects"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Contact
            </a>
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Dashboard
            </Link>
            <DarkModeToggle />
          </div>
          <div className="flex items-center space-x-2 md:hidden">
            <DarkModeToggle />
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-7xl dark:text-gray-100">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kevin Tong
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            A passionate developer creating beautiful and functional web experiences. Welcome to my
            digital portfolio where I showcase my journey and projects.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="text-base"
              onClick={() =>
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto">
          <h2 className="mb-16 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
            About Me
          </h2>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                I'm a developer passionate about creating digital experiences that matter. With a
                focus on modern web technologies, I enjoy turning complex problems into simple,
                beautiful, and intuitive solutions.
              </p>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                When I'm not coding, you can find me exploring new technologies, contributing to
                open-source projects, or enjoying a good cup of coffee while planning my next
                creative venture.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  React Enthusiast
                </span>
                <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  TypeScript Lover
                </span>
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  UI/UX Focused
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>React, TypeScript, Tailwind</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Node.js, Python, APIs</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Git, VS Code, Figma</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>AI/ML, Cloud, Mobile</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-16 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
            Skills & Expertise
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SkillsSection
              title="Frontend Development"
              skills={[
                { name: 'React', level: 90, color: 'blue' },
                { name: 'TypeScript', level: 85, color: 'indigo' },
                { name: 'Tailwind CSS', level: 88, color: 'purple' },
                { name: 'HTML/CSS', level: 95, color: 'orange' },
              ]}
            />
            <SkillsSection
              title="Backend & Database"
              skills={[
                { name: 'Node.js', level: 80, color: 'green' },
                { name: 'Python', level: 75, color: 'blue' },
                { name: 'PostgreSQL', level: 70, color: 'indigo' },
                { name: 'API Design', level: 82, color: 'purple' },
              ]}
            />
            <SkillsSection
              title="Tools & Others"
              skills={[
                { name: 'Git/GitHub', level: 90, color: 'orange' },
                { name: 'VS Code', level: 95, color: 'blue' },
                { name: 'Figma', level: 78, color: 'pink' },
                { name: 'Testing', level: 72, color: 'green' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-16 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
            Featured Projects
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Personal Dashboard Project */}
            <Card className="group overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-gray-800/25">
              <div className="cursor-pointer" onClick={() => window.open('/dashboard', '_blank')}>
                <DashboardPreview />
              </div>
              <CardHeader>
                <CardTitle>Personal Dashboard</CardTitle>
                <CardDescription>
                  A beautiful personal dashboard with weather, clock, todo list, inspirational quotes, and bookmarks. Built with React and TypeScript.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    React
                  </span>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    TypeScript
                  </span>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                    Weather API
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/yourusername/portfolio" target="_blank" rel="noopener noreferrer">
                      View Code
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/dashboard">Live Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* E-Commerce Platform */}
            <Card className="group overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-gray-800/25">
              <div className="cursor-pointer">
                <ECommercePreview />
              </div>
              <CardHeader>
                <CardTitle>E-Commerce Platform</CardTitle>
                <CardDescription>
                  A modern e-commerce solution built with React and Node.js, featuring secure
                  payments and responsive design.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    React
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Node.js
                  </span>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    MongoDB
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Code
                  </Button>
                  <Button size="sm">Live Demo</Button>
                </div>
              </CardContent>
            </Card>

            {/* Task Management App */}
            <Card className="group overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-gray-800/25">
              <div className="cursor-pointer">
                <TaskManagementPreview />
              </div>
              <CardHeader>
                <CardTitle>Task Management App</CardTitle>
                <CardDescription>
                  A collaborative task management application with real-time updates and team
                  collaboration features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    TypeScript
                  </span>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Socket.io
                  </span>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    PostgreSQL
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Code
                  </Button>
                  <Button size="sm">Live Demo</Button>
                </div>
              </CardContent>
            </Card>

            {/* Weather Dashboard */}
            <Card className="group overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-gray-800/25">
              <div className="cursor-pointer" onClick={() => window.open('/weather', '_blank')}>
                <WeatherDashboardPreview />
              </div>
              <CardHeader>
                <CardTitle>Weather Dashboard</CardTitle>
                <CardDescription>
                  A comprehensive weather dashboard with location-based forecasts, hourly predictions, 7-day outlook, and interactive weather data visualization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    React
                  </span>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    TypeScript
                  </span>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                    OpenWeather API
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/yourusername/portfolio" target="_blank" rel="noopener noreferrer">
                      View Code
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/weather">Live Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-20 dark:bg-gray-950">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
            Let's Work Together
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            I'm always interested in new opportunities and exciting projects. Let's connect and
            discuss how we can bring your ideas to life.
          </p>

          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Get In Touch
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Feel free to reach out if you're looking for a developer, have a question, or just
                  want to connect.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <svg
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
                    <p className="text-gray-600 dark:text-gray-400">kevin.tong1@hotmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <svg
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">GitHub</p>
                    <p className="text-gray-600 dark:text-gray-400">kevintongg</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Download Resume
                </Button>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Kevin Tong. Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
