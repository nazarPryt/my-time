import React from 'react'
import ReactDOM from 'react-dom/client'
import { installGlobalErrorReporting } from '@/bll/error-reporting/error-reporting-service'
import App from './app.tsx'
import './style.css'

installGlobalErrorReporting()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
