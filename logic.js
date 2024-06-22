let currentTafsir = "";
        //upper js code//
        tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
            colors: {
                primary: {
                50: "#f0fdfa",
                100: "#ccfbf1",
                200: "#99f6e4",
                300: "#5eead4",
                400: "#2dd4bf",
                500: "#14b8a6",
                600: "#0d9488",
                700: "#0f766e",
                800: "#115e59",
                900: "#134e4a",
                },
                secondary: {
                50: "#fdf2f8",
                100: "#fce7f3",
                200: "#fbcfe8",
                300: "#f9a8d4",
                400: "#f472b6",
                500: "#ec4899",
                600: "#db2777",
                700: "#be185d",
                800: "#9d174d",
                900: "#831843",
                },
                accent: {
                50: "#fff7ed",
                100: "#ffedd5",
                200: "#fed7aa",
                300: "#fdba74",
                400: "#fb923c",
                500: "#f97316",
                600: "#ea580c",
                700: "#c2410c",
                800: "#9a3412",
                900: "#7c2d12",
                },
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
                arabic: ["Noto Naskh Arabic", "serif"],
            },
            },
        },
        };

        const playPauseBtn = document.getElementById("play-pause-btn");
        const audioElement = document.getElementById("verse-audio");
        playPauseBtn.addEventListener("click", () => {
            if (audioElement.paused) {
                audioElement.play();
                playPauseBtn.innerHTML = `
                    <svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Pause
                `;
            } else {
                audioElement.pause();
                playPauseBtn.innerHTML = `<svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Play`;
            }
        });
        

        function toggleDarkMode() {
        const htmlElement = document.documentElement;
        htmlElement.classList.toggle("dark");
        const isDarkMode = htmlElement.classList.contains("dark");
        localStorage.setItem("isDarkMode", isDarkMode);
        }

        document
        .getElementById("theme-toggle")
        .addEventListener("click", toggleDarkMode);

        const isDarkMode = localStorage.getItem("isDarkMode") === "true";
        if (isDarkMode) {
        document.documentElement.classList.add("dark");
        }

        document.getElementById("search-btn").addEventListener("click", () => {
        document.getElementById("search-modal").classList.remove("hidden");
        });

        document.getElementById("close-search-btn").addEventListener("click", () => {
        document.getElementById("search-modal").classList.add("hidden");
        });

        document.getElementById("search-submit").addEventListener("click", () => {
        const searchTerm = document
            .getElementById("search-input")
            .value.toLowerCase();
        const searchResults = favorites.filter(
            (item) =>
            item.content.toLowerCase().includes(searchTerm) ||
            item.arabic.toLowerCase().includes(searchTerm) ||
            item.translation.toLowerCase().includes(searchTerm)
        );

        const resultsContainer = document.getElementById("search-results");
        resultsContainer.innerHTML = "";

        if (searchResults.length === 0) {
            resultsContainer.innerHTML =
            '<p class="text-center text-gray-600 dark:text-gray-400">No results found.</p>';
        } else {
            searchResults.forEach((result) => {
            const resultItem = document.createElement("div");
            resultItem.classList.add(
                "bg-gray-100",
                "dark:bg-gray-700",
                "rounded-lg",
                "p-4",
                "mb-4"
            );
            resultItem.innerHTML = `
                                <p class="text-lg font-arabic">${result.arabic}</p>
                                <p class="text-xl font-bold">${result.content}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${result.translation}</p>
                                <p class="text-xs text-primary-600 dark:text-primary-400">${result.source}</p>
                            `;
            resultsContainer.appendChild(resultItem);
            });
        }
        });

        // Function to fetch and display a random wisdom
        async function getWisdom(type) {
        try {
            switch (type) {
            case "advice":
                const adviceResponse = await fetch("https://api.adviceslip.com/advice");
                const adviceData = await adviceResponse.json();
                updateContent(adviceData.slip.advice, "", "Advice Slip API");
                break;
            case "hadith":
                const randomHadith =
                hadiths[Math.floor(Math.random() * hadiths.length)];
                updateContent(randomHadith.hadith, "", randomHadith.reference);
                break;
                
                case "quran":
                    const randomSura = Math.floor(Math.random() * 114) + 1;
                    const [arabicResponse, englishResponse, audioResponse, tafsirResponse] = await Promise.all([
                        fetch(`${QURAN_API_BASE_URL}/surah/${randomSura}/ar.alafasy`),
                        fetch(`${QURAN_API_BASE_URL}/surah/${randomSura}/en.asad`),
                        fetch(`${QURAN_API_BASE_URL}/surah/${randomSura}/ar.alafasy`),
                        fetch(`https://quranenc.com/api/v1/translation/sura/english_saheeh/${randomSura}`)
                    ]);
                    const [arabicData, englishData, audioData, tafsirData] = await Promise.all([
                        arabicResponse.json(),
                        englishResponse.json(),
                        audioResponse.json(),
                        tafsirResponse.json()
                    ]);
                    const randomAya = Math.floor(Math.random() * arabicData.data.ayahs.length);
                    const arabicVerse = arabicData.data.ayahs[randomAya];
                    const englishVerse = englishData.data.ayahs[randomAya];
                    const audioVerse = audioData.data.ayahs[randomAya];
                    const tafsirVerse = tafsirData.result[randomAya];
                    updateContent(
                        englishVerse.text,
                        arabicVerse.text,
                        `${englishData.data.englishName} [${englishData.data.englishNameTranslation}] - ${englishVerse.numberInSurah}`,
                        englishVerse.translation,
                        audioVerse.audio,
                        tafsirVerse.footnotes
                    );
                    break;
                
            }
        } catch (error) {
            console.error("Error fetching wisdom:", error);
            updateContent("Error fetching wisdom. Please try again.", "", "");
        }
        }

        //   // Function to update the content displayed on the page
        //   function updateContent(content, arabic, source, translation = "") {

        //   }
        function updateContent(
            content,
            arabic,
            source,
            translation = "",
            audioUrl = "",
            tafsir = ""
        ) {
            currentContent = content;
            currentArabic = arabic;
            currentSource = source;
            currentTranslation = translation;
            currentTafsir = tafsir;
            document.getElementById("content-arabic").innerText = arabic;
            document.getElementById("content-text").innerText = content;
            document.getElementById("content-source").innerText = source;
            document.getElementById("content-translation").innerText = translation;
        
            const audioElement = document.getElementById("verse-audio");
            const playPauseBtn = document.getElementById("play-pause-btn");
            const showTafsirBtn = document.getElementById("show-tafsir-btn");
        
            if (audioUrl) {
                audioElement.src = audioUrl;
                audioElement.classList.remove("hidden");
                playPauseBtn.classList.remove("hidden");
            } else {
                audioElement.classList.add("hidden");
                playPauseBtn.classList.add("hidden");
            }
        
            if (tafsir) {
                showTafsirBtn.classList.remove("hidden");
            } else {
                showTafsirBtn.classList.add("hidden");
            }
        }
        document.getElementById("show-tafsir-btn").addEventListener("click", () => {
            document.getElementById("tafsir-modal").classList.remove("hidden");
            document.getElementById("tafsir-content").innerHTML = currentTafsir;
        });
        
        document.getElementById("close-tafsir-btn").addEventListener("click", () => {
            document.getElementById("tafsir-modal").classList.add("hidden");
        });

        // Function to share the current wisdom
        function shareContent() {
        const shareData = {
            title: "Islamic Wisdom",
            text: `${currentArabic}\n\n${currentContent}\n\n${currentTranslation}\n\nSource: ${currentSource}`,
            url: window.location.href,
        };
        if (navigator.share) {
            navigator
            .share(shareData)
            .catch((error) => console.error("Error sharing content:", error));
        } else {
            alert("Sharing is not supported on this device.");
        }
        }

        // Function to add the current wisdom to favorites
        function favoriteContent() {
        favorites.push({
            arabic: currentArabic,
            content: currentContent,
            source: currentSource,
            translation: currentTranslation,
        });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Content added to favorites");
        }

        // Function to load and display the list of favorite wisdoms
        function loadFavorites() {
        const favoritesList = document.getElementById("favorites-list");
        favoritesList.innerHTML = ""; // Clear existing list items

        if (favorites.length === 0) {
            const noFavoritesItem = document.createElement("li");
            noFavoritesItem.textContent = "No favorites yet.";
            favoritesList.appendChild(noFavoritesItem);
        } else {
            favorites.forEach((favorite, index) => {
            const favoriteItem = document.createElement("li");
            favoriteItem.classList.add("py-4", "flex", "flex-col", "gap-2");

            favoriteItem.innerHTML = `
                                <p class="text-lg font-arabic">${favorite.arabic}</p>
                                <p class="text-xl font-bold">${favorite.content}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${favorite.translation}</p>
                                <p class="text-xs text-primary-600 dark:text-primary-400">${favorite.source}</p>
                            `;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("btn-secondary", "mt-2", "self-start");
            removeButton.addEventListener("click", () => {
                favorites.splice(index, 1);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                loadFavorites();
            });
            favoriteItem.appendChild(removeButton);

            favoritesList.appendChild(favoriteItem);
            });
        }
        }

        // Event listener for the "Show Favorites" button
        document.getElementById("show-favorites-btn").addEventListener("click", () => {
        const favoritesModal = document.getElementById("favorites-modal");
        favoritesModal.classList.remove("hidden");
        loadFavorites();
        });

        // Event listener for the "Close" button in the favorites modal
        document.getElementById("close-favorites-btn").addEventListener("click", () => {
        const favoritesModal = document.getElementById("favorites-modal");
        favoritesModal.classList.add("hidden");
        });

        // Initialize with a random wisdom
        getWisdom(["advice", "hadith", "quran"][Math.floor(Math.random() * 3)]);

        // Hadiths array (you may want to expand this or fetch from an API)
        const hadiths = [
        {
            hadith:
            "The best among you are those who have the best manners and character.",
            reference: "Sahih al-Bukhari 3559",
        },
        {
            hadith:
            "None of you [truly] believes until he loves for his brother what he loves for himself.",
            reference: "Sahih al-Bukhari 13",
        },
        // Add more hadiths here
        ];

        // Constants for API endpoints
        const QURAN_API_BASE_URL = "https://api.alquran.cloud/v1";

        //prayer times
        async function getPrayerTimes() {
        try {
            // Get user's location
            const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;

            // Fetch prayer times
            const response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            const data = await response.json();

            const timings = data.data.timings;
            const date = data.data.date.readable;

            // Display prayer times
            const prayerTimesContent = document.getElementById("prayer-times-content");
            prayerTimesContent.innerHTML = `
                    <p class="text-center mb-4">Prayer times for ${date}</p>
                    <ul class="space-y-2">
                        <li>Fajr: ${timings.Fajr}</li>
                        <li>Sunrise: ${timings.Sunrise}</li>
                        <li>Dhuhr: ${timings.Dhuhr}</li>
                        <li>Asr: ${timings.Asr}</li>
                        <li>Maghrib: ${timings.Maghrib}</li>
                        <li>Isha: ${timings.Isha}</li>
                    </ul>
                `;

            // Show the modal
            document.getElementById("prayer-times-modal").classList.remove("hidden");
        } catch (error) {
            console.error("Error fetching prayer times:", error);
            alert("Unable to fetch prayer times. Please try again.");
        }
        }

        // Event listener for closing the prayer times modal
        document
        .getElementById("close-prayer-times-btn")
        .addEventListener("click", () => {
            document.getElementById("prayer-times-modal").classList.add("hidden");
        });
