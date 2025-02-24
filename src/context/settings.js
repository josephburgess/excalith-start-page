import { createContext, useContext, useEffect, useState } from "react"
import defaultConfig from "data/settings"

const IS_DOCKER = process.env.BUILD_MODE === "docker"

export const SettingsContext = createContext({
	settings: undefined,
	setSettings: (settings) => {}
})

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState()

	useEffect(() => {
		if (IS_DOCKER) {
			fetch("/api/loadSettings")
				.then((response) => response.json())
				.then((data) => setSettings(data))
				.catch(() => setSettings(defaultConfig))
		} else {
			fetch("/api/loadSettings")
				.then((response) => response.json())
				.then((data) => setSettings(data))
				.catch(() => setSettings(defaultConfig))
		}
	}, [])

	const updateSettings = async (newSettings) => {
		setSettings(newSettings)

		if (IS_DOCKER) {
			fetch("/api/saveSettings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newSettings)
			})
		}
	}

	// Reset settings
	const resetSettings = () => {
		setSettings(defaultConfig)
	}

	return (
		<SettingsContext.Provider value={{ settings, setSettings: updateSettings, resetSettings }}>
			{children}
		</SettingsContext.Provider>
	)
}
