
import React from 'react'
import LandingPic from '../assets/Whity.jpg'
import { useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  ArrowRightCircle,
  Upload,
  Database,
  BrushCleaning,
  ChartNoAxesCombined,
  FileBarChart,
  ShieldCheck,
  Workflow,
  Sparkles
} from 'lucide-react'

const LandingPage = () => {

  const navi = useNavigate()

  const features = [
    {
      icon: Upload,
      title: 'Dataset Upload',
      desc: 'Upload CSV files and explore dataset structure, rows, columns and data quality.'
    },
    {
      icon: BrushCleaning,
      title: 'Data Cleaning',
      desc: 'Identify missing values, duplicates and inconsistencies to prepare reliable data.'
    },
    {
      icon: ChartNoAxesCombined,
      title: 'Data Visualization',
      desc: 'Explore patterns, distributions and statistical insights through interactive charts.'
    },
    {
      icon: FileBarChart,
      title: 'Analytical Reports',
      desc: 'Generate structured reports with dataset summaries and analysis results.'
    }
  ]

  const workflow = [
    {
      number: '01',
      title: 'Upload Dataset',
      desc: 'Select and upload your CSV file.'
    },
    {
      number: '02',
      title: 'Explore Data',
      desc: 'Inspect rows, columns, data types and statistical summaries.'
    },
    {
      number: '03',
      title: 'Clean & Process',
      desc: 'Identify and handle missing values, duplicates and inconsistencies.'
    },
    {
      number: '04',
      title: 'Visualize & Analyze',
      desc: 'Understand your data using charts, graphs and statistical insights.'
    },
    {
      number: '05',
      title: 'Generate Report',
      desc: 'Review your analysis and export the final report as PDF.'
    }
  ]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen">

      {/* ================= NAVBAR ================= */}

      <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-5 flex justify-between items-center bg-black/70 backdrop-blur-xl border-b border-white/10">

        <h1 className="text-2xl font-semibold tracking-wide">
          Analyzer <span className="text-cyan-400">X</span>
        </h1>

        <div className="hidden md:flex items-center gap-9 text-sm text-gray-300">
          <button onClick={() => scrollTo('home')} className="hover:text-cyan-400 transition">
            Home
          </button>
          <button onClick={() => scrollTo('workflow')} className="hover:text-cyan-400 transition">
            Workflow
          </button>
          <button onClick={() => scrollTo('instructions')} className="hover:text-cyan-400 transition">
            Instructions
          </button>
        </div>

        <button
          onClick={() => navi('/Interface')}
          className="px-5 py-2.5 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition flex items-center gap-2"
        >
          Get Started <ArrowRight size={17}/>
        </button>

      </nav>


      {/* ================= PAGE 1: MAIN SECTION ================= */}

      <section
        id="home"
        className="relative min-h-screen bg-cover bg-center flex items-center pt-24"
        style={{ backgroundImage: `url(${LandingPic})` }}
      >

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30"/>
        <div className="absolute inset-0 bg-black/10"/>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 md:px-16 py-20">

          <div className="max-w-3xl">

            <div className="flex items-center gap-2 text-cyan-400 mb-6">
              <Sparkles size={17}/>
              <span className="text-xs uppercase tracking-[0.3em]">
                Intelligent Data Analysis Platform
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-light tracking-tight">
              Analyzer <span className="text-cyan-400 font-semibold">X</span>
            </h1>

            <h2 className="text-3xl md:text-4xl font-light text-gray-200 mt-5 leading-tight">
              Transform Raw Data Into
              <span className="text-cyan-400"> Meaningful Insights.</span>
            </h2>

            <p className="text-gray-300 mt-7 leading-8 text-base md:text-lg max-w-2xl">
              Analyzer X is a versatile CSV dataset analysis platform
              designed to simplify data exploration, cleaning, processing
              and visualization. Upload your dataset, understand its quality,
              discover patterns and generate meaningful analytical reports
              through a unified workspace.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">

              <button
                onClick={() => navi('/Interface')}
                className="flex items-center gap-3 px-7 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition hover:scale-105"
              >
                Get Started
                <ArrowRightCircle size={23}/>
              </button>

              <button
                onClick={() => scrollTo('workflow')}
                className="px-7 py-4 border border-white/40 rounded-lg hover:bg-white/10 transition"
              >
                Explore Workflow
              </button>

            </div>

          </div>

          {/* Feature Highlights */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-5xl">

            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <div
                  key={index}
                  className="p-5 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl hover:border-cyan-400/50 transition"
                >
                  <Icon size={27} className="text-cyan-400 mb-4"/>
                  <h3 className="font-semibold text-sm md:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-5">
                    {feature.desc}
                  </p>
                </div>
              )
            })}

          </div>

        </div>
      </section>


      {/* ================= PAGE 2: WORKFLOW & INSTRUCTIONS ================= */}

      <section id="workflow" className="scroll-mt-20 py-24 px-8 md:px-16">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-4">
              Simple & Structured Process
            </p>

            <h2 className="text-4xl md:text-5xl font-light">
              How Analyzer <span className="text-cyan-400">X Works</span>
            </h2>

            <p className="text-gray-400 mt-5 max-w-2xl mx-auto leading-7">
              Follow a structured workflow to convert raw CSV datasets
              into clean, organized and understandable analytical results.
            </p>

          </div>

          {/* Workflow */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

            {workflow.map((step, index) => (
              <div
                key={index}
                className="relative p-6 bg-white/[0.035] border border-white/10 rounded-xl hover:border-cyan-400/50 transition"
              >

                <span className="text-4xl font-light text-cyan-400/70">
                  {step.number}
                </span>

                <h3 className="text-lg font-semibold mt-6 mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-400 leading-6">
                  {step.desc}
                </p>

                {index !== 4 && (
                  <ArrowRight
                    size={19}
                    className="hidden lg:block absolute -right-3 top-1/2 text-cyan-400"
                  />
                )}

              </div>
            ))}

          </div>


          {/* Instructions */}

          <div id="instructions" className="scroll-mt-24 mt-20 grid md:grid-cols-2 gap-10 items-center">

            <div>

              <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-4">
                User Guide
              </p>

              <h2 className="text-3xl md:text-4xl font-light">
                Before You <span className="text-cyan-400">Begin</span>
              </h2>

              <p className="text-gray-400 leading-7 mt-5">
                Getting started with Analyzer X is simple. Prepare your
                dataset and follow the application workflow to begin
                exploring your data.
              </p>

              <button
                onClick={() => navi('/Interface')}
                className="mt-8 flex items-center gap-3 px-7 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition"
              >
                Upload Your Dataset <ArrowRight size={19}/>
              </button>

            </div>

            <div className="p-7 md:p-9 rounded-2xl bg-white/[0.035] border border-white/10">

              <h3 className="text-xl font-semibold mb-7">
                Important Instructions
              </h3>

              <div className="space-y-6">

                <div className="flex gap-4">
                  <Upload className="text-cyan-400 shrink-0" size={23}/>
                  <div>
                    <h4 className="font-semibold">Supported File Format</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Currently, CSV (.csv) datasets are supported.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Database className="text-cyan-400 shrink-0" size={23}/>
                  <div>
                    <h4 className="font-semibold">Structured Data</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Your file should contain organized rows and columns
                      with appropriate headers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <ShieldCheck className="text-cyan-400 shrink-0" size={23}/>
                  <div>
                    <h4 className="font-semibold">Review Your Data</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Check cleaning results and verify processed data
                      before using it for further analysis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Workflow className="text-cyan-400 shrink-0" size={23}/>
                  <div>
                    <h4 className="font-semibold">Follow the Workflow</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Complete each stage to get meaningful analytical
                      results and reports.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= PAGE 3: FOOTER ================= */}

      <footer className="border-t border-white/10 bg-[#080808] px-8 md:px-16 pt-14 pb-7">

        <div className="max-w-7xl mx-auto">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

            {/* Brand */}

            <div className="lg:col-span-2">

              <h2 className="text-3xl font-semibold tracking-wide">
                Analyzer <span className="text-cyan-400">X</span>
              </h2>

              <p className="text-gray-400 mt-4 leading-7 max-w-md">
                A versatile dataset analysis platform that helps transform
                raw CSV data into meaningful insights through data cleaning,
                processing, visualization and analytical reporting.
              </p>

            </div>


            {/* Quick Links */}

            <div>

              <h3 className="font-semibold mb-5">Quick Links</h3>

              <div className="flex flex-col gap-4 text-sm text-gray-400">

                <button onClick={() => scrollTo('home')} className="text-left hover:text-cyan-400 transition">
                  Home
                </button>

                <button onClick={() => scrollTo('workflow')} className="text-left hover:text-cyan-400 transition">
                  Workflow
                </button>

                <button onClick={() => scrollTo('instructions')} className="text-left hover:text-cyan-400 transition">
                  Instructions
                </button>

                <button onClick={() => navi('/Interface')} className="text-left hover:text-cyan-400 transition">
                  Get Started
                </button>

              </div>

            </div>


            {/* Platform */}

            <div>

              <h3 className="font-semibold mb-5">Platform</h3>

              <div className="flex flex-col gap-4 text-sm text-gray-400">

                <span>CSV Dataset Upload</span>
                <span>Data Cleaning</span>
                <span>Data Visualization</span>
                <span>Analytical Reports</span>

              </div>

            </div>

          </div>


          {/* Bottom Footer */}

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Analyzer X. All Rights Reserved.
            </p>

            <p className="text-gray-500 text-sm flex items-center gap-2">
              Designed for Data Exploration
              <Sparkles size={15} className="text-cyan-400"/>
            </p>

          </div>

        </div>

      </footer>

    </div>
  )
}

export default LandingPage
