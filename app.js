// Diet Tracker PWA - Main Application Logic

// Database configuration
const DB_NAME = 'DietTrackerDB';
const DB_VERSION = 1;
let db;

// Food database
const FOOD_DATABASE = {
    owoce: [
        { name: 'Jabłko', kcal: 52, carbs: 14, protein: 0.3, fat: 0.2 },
        { name: 'Banan', kcal: 89, carbs: 23, protein: 1.1, fat: 0.3 },
        { name: 'Pomarańcza', kcal: 47, carbs: 12, protein: 0.9, fat: 0.1 },
        { name: 'Gruszka', kcal: 57, carbs: 15, protein: 0.4, fat: 0.1 },
        { name: 'Truskawki', kcal: 32, carbs: 8, protein: 0.7, fat: 0.3 },
        { name: 'Maliny', kcal: 52, carbs: 12, protein: 1.2, fat: 0.7 },
        { name: 'Borówki', kcal: 57, carbs: 14, protein: 0.7, fat: 0.3 },
        { name: 'Arbuz', kcal: 30, carbs: 8, protein: 0.6, fat: 0.2 },
        { name: 'Winogrona', kcal: 69, carbs: 18, protein: 0.7, fat: 0.2 },
        { name: 'Kiwi', kcal: 61, carbs: 15, protein: 1.1, fat: 0.5 }
    ],
    warzywa: [
        { name: 'Pomidor', kcal: 18, carbs: 4, protein: 0.9, fat: 0.2 },
        { name: 'Ogórek', kcal: 15, carbs: 3.6, protein: 0.7, fat: 0.1 },
        { name: 'Papryka czerwona', kcal: 31, carbs: 6, protein: 1, fat: 0.3 },
        { name: 'Marchew', kcal: 41, carbs: 10, protein: 0.9, fat: 0.2 },
        { name: 'Brokuły', kcal: 34, carbs: 7, protein: 2.8, fat: 0.4 },
        { name: 'Kalafior', kcal: 25, carbs: 5, protein: 1.9, fat: 0.3 },
        { name: 'Sałata', kcal: 15, carbs: 2.9, protein: 1.4, fat: 0.2 },
        { name: 'Szpinak', kcal: 23, carbs: 3.6, protein: 2.9, fat: 0.4 },
        { name: 'Cukinia', kcal: 17, carbs: 3.1, protein: 1.2, fat: 0.3 },
        { name: 'Buraki', kcal: 43, carbs: 10, protein: 1.6, fat: 0.2 }
    ],
    mieso: [
        { name: 'Pierś z kurczaka', kcal: 165, carbs: 0, protein: 31, fat: 3.6 },
        { name: 'Udko z kurczaka', kcal: 209, carbs: 0, protein: 26, fat: 11 },
        { name: 'Schab wieprzowy', kcal: 143, carbs: 0, protein: 21, fat: 6 },
        { name: 'Polędwica wieprzowa', kcal: 143, carbs: 0, protein: 21, fat: 6 },
        { name: 'Wołowina rostbef', kcal: 250, carbs: 0, protein: 26, fat: 16 },
        { name: 'Indyk pierś', kcal: 135, carbs: 0, protein: 30, fat: 1 }
    ],
    ryby: [
        { name: 'Łosoś', kcal: 208, carbs: 0, protein: 20, fat: 13 },
        { name: 'Dorsz', kcal: 82, carbs: 0, protein: 18, fat: 0.7 },
        { name: 'Tuńczyk', kcal: 144, carbs: 0, protein: 23, fat: 5 },
        { name: 'Makrela', kcal: 205, carbs: 0, protein: 19, fat: 14 },
        { name: 'Pstrąg', kcal: 119, carbs: 0, protein: 20, fat: 3.5 }
    ],
    pieczywo: [
        { name: 'Chleb żytni', kcal: 259, carbs: 48, protein: 8.5, fat: 3.3 },
        { name: 'Chleb pszenny', kcal: 265, carbs: 49, protein: 9, fat: 3.2 },
        { name: 'Chleb graham', kcal: 250, carbs: 44, protein: 9, fat: 4 },
        { name: 'Bułka pszenna', kcal: 248, carbs: 48, protein: 8, fat: 3.3 }
    ],
    nabial: [
        { name: 'Mleko 2%', kcal: 50, carbs: 4.8, protein: 3.3, fat: 2 },
        { name: 'Jogurt naturalny', kcal: 61, carbs: 4.7, protein: 3.5, fat: 3.3 },
        { name: 'Ser biały półtłusty', kcal: 98, carbs: 3.4, protein: 12, fat: 4 },
        { name: 'Ser żółty Gouda', kcal: 356, carbs: 2.2, protein: 25, fat: 27 },
        { name: 'Jajko kurze', kcal: 155, carbs: 1.1, protein: 13, fat: 11 }
    ],
    ziarna: [
        { name: 'Ryż biały gotowany', kcal: 130, carbs: 28, protein: 2.7, fat: 0.3 },
        { name: 'Ryż brązowy gotowany', kcal: 112, carbs: 24, protein: 2.6, fat: 0.9 },
        { name: 'Kasza gryczana gotowana', kcal: 92, carbs: 20, protein: 3.4, fat: 0.6 },
        { name: 'Makaron gotowany', kcal: 131, carbs: 25, protein: 5, fat: 1.1 },
        { name: 'Płatki owsiane', kcal: 389, carbs: 66, protein: 17, fat: 7 }
    ]
};

const READY_MEALS = [
    { name: 'Owsianka z owocami', ingredients: 'Płatki owsiane 50g, mleko 200ml, banan 100g, maliny 50g', kcal: 350, carbs: 58, protein: 14, fat: 8, mealType: 'breakfast' },
    { name: 'Jajecznica z chlebem', ingredients: 'Jajka 3 szt, chleb żytni 60g, pomidor 100g', kcal: 445, carbs: 32, protein: 26, fat: 24, mealType: 'breakfast' },
    { name: 'Tost z awokado', ingredients: 'Chleb graham 50g, awokado 80g, jajko 1 szt', kcal: 420, carbs: 35, protein: 18, fat: 24, mealType: 'breakfast' },
    { name: 'Smoothie bowl', ingredients: 'Banan 120g, truskawki 100g, jogurt 150g', kcal: 380, carbs: 65, protein: 12, fat: 8, mealType: 'breakfast' },
    
    { name: 'Kurczak z ryżem i warzywami', ingredients: 'Pierś kurczaka 150g, ryż 150g, brokuły 100g', kcal: 470, carbs: 50, protein: 50, fat: 7, mealType: 'lunch' },
    { name: 'Łosoś z ziemniakami', ingredients: 'Łosoś 120g, ziemniaki 200g, szpinak 100g', kcal: 520, carbs: 45, protein: 35, fat: 20, mealType: 'lunch' },
    { name: 'Dorsz z kaszą', ingredients: 'Dorsz 150g, kasza gryczana 150g, surówka 100g', kcal: 450, carbs: 52, protein: 38, fat: 6, mealType: 'lunch' },
    { name: 'Makaron z sosem', ingredients: 'Makaron 150g, sos pomidorowy 100g, mięso mielone 100g', kcal: 520, carbs: 58, protein: 35, fat: 16, mealType: 'lunch' },
    
    { name: 'Sałatka z tuńczykiem', ingredients: 'Tuńczyk 150g, warzywa 200g', kcal: 320, carbs: 12, protein: 38, fat: 14, mealType: 'dinner' },
    { name: 'Kasza z indykiem', ingredients: 'Indyk 120g, kasza 150g, warzywa 100g', kcal: 380, carbs: 38, protein: 42, fat: 6, mealType: 'dinner' },
    { name: 'Omlet z warzywami', ingredients: 'Jajka 3 szt, papryka 80g, pomidor 80g', kcal: 340, carbs: 15, protein: 28, fat: 20, mealType: 'dinner' },
    { name: 'Sałatka grecka z kurczakiem', ingredients: 'Kurczak 120g, warzywa 150g, ser 50g', kcal: 410, carbs: 18, protein: 42, fat: 20, mealType: 'dinner' },
    
    { name: 'Jogurt z orzechami', ingredients: 'Jogurt 200g, migdały 20g', kcal: 240, carbs: 24, protein: 12, fat: 12, mealType: 'snack' },
    { name: 'Kanapka z serem', ingredients: 'Chleb 50g, ser biały 50g, pomidor 50g', kcal: 220, carbs: 28, protein: 14, fat: 5, mealType: 'snack' },
    { name: 'Owoce z orzechami', ingredients: 'Jabłko 150g, orzechy 15g', kcal: 180, carbs: 25, protein: 3, fat: 10, mealType: 'snack' },
    { name: 'Smoothie proteinowe', ingredients: 'Banan 120g, mleko 200ml', kcal: 280, carbs: 45, protein: 11, fat: 5, mealType: 'snack' }
];

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            if (!db.objectStoreNames.contains('meals')) {
                const mealStore = db.createObjectStore('meals', { keyPath: 'id', autoIncrement: true });
                mealStore.createIndex('date', 'date', { unique: false });
                mealStore.createIndex('mealType', 'mealType', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
        };
    });
}

// Settings management
async function loadSettings() {
    const defaults = {
        dailyCalories: 1800,
        dailyCarbs: 200,
        dailyProtein: 90,
        dailyFat: 60,
        fastingStart: '17:00',
        fastingEnd: '09:00',
        breakfastTime: '09:00',
        snack1Time: '11:30',
        lunchTime: '13:00',
        snack2Time: '15:30',
        dinnerTime: '16:30'
    };
    
    try {
        const tx = db.transaction(['settings'], 'readonly');
        const store = tx.objectStore('settings');
        const settings = {};
        
        for (const key in defaults) {
            const request = store.get(key);
            const result = await new Promise((resolve) => {
                request.onsuccess = () => resolve(request.result);
            });
            settings[key] = result ? result.value : defaults[key];
        }
        
        return settings;
    } catch (e) {
        return defaults;
    }
}

async function saveSetting(key, value) {
    const tx = db.transaction(['settings'], 'readwrite');
    const store = tx.objectStore('settings');
    await store.put({ key, value });
}

// Meal management
async function addMeal(mealData) {
    const tx = db.transaction(['meals'], 'readwrite');
    const store = tx.objectStore('meals');
    const meal = {
        ...mealData,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };
    await store.add(meal);
    return meal;
}

async function getTodayMeals() {
    const today = new Date().toISOString().split('T')[0];
    const tx = db.transaction(['meals'], 'readonly');
    const store = tx.objectStore('meals');
    const index = store.index('date');
    const request = index.getAll(today);
    
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result || []);
    });
}

async function deleteMeal(id) {
    const tx = db.transaction(['meals'], 'readwrite');
    const store = tx.objectStore('meals');
    await store.delete(id);
}

// UI State
let currentView = 'diary';
let currentMealType = 'breakfast';
let selectedFood = null;
let currentModalTab = 'ready';
let selectedCategory = 'owoce';

// Initialize app
async function initApp() {
    await initDB();
    
    const settings = await loadSettings();
    updateSettingsUI(settings);
    
    updateClock();
    setInterval(updateClock, 1000);
    
    updateFastingStatus();
    setInterval(updateFastingStatus, 60000);
    
    await renderDiary();
    
    checkNotificationPermission();
    
    setTimeout(showInstallPrompt, 30000);
    
    scheduleNotifications();
}

// Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// Fasting status
async function updateFastingStatus() {
    const settings = await loadSettings();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.fastingStart.split(':').map(Number);
    const [endHour, endMin] = settings.fastingEnd.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    let isFasting;
    if (startTime > endTime) {
        isFasting = currentTime >= startTime || currentTime < endTime;
    } else {
        isFasting = currentTime >= startTime && currentTime < endTime;
    }
    
    const statusEl = document.getElementById('fastingStatus');
    const timeEl = document.getElementById('fastingTime');
    
    if (isFasting) {
        const endDateTime = new Date();
        endDateTime.setHours(endHour, endMin, 0);
        if (currentTime >= startTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
        }
        
        const diff = endDateTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        statusEl.textContent = '⏳ Post';
        timeEl.textContent = `Do końca: ${hours}h ${minutes}min`;
    } else {
        statusEl.textContent = '✅ Okno żywieniowe';
        timeEl.textContent = '';
    }
}

// Render diary
async function renderDiary() {
    const meals = await getTodayMeals();
    const settings = await loadSettings();
    
    const mealTypes = {
        breakfast: { name: '🥐 Śniadanie', time: settings.breakfastTime },
        snack1: { name: '🍎 Przekąska', time: settings.snack1Time },
        lunch: { name: '🍽️ Obiad', time: settings.lunchTime },
        snack2: { name: '🥤 Przekąska', time: settings.snack2Time },
        dinner: { name: '🌙 Kolacja', time: settings.dinnerTime }
    };
    
    const diaryEl = document.getElementById('diaryView');
    diaryEl.innerHTML = '';
    
    for (const [type, info] of Object.entries(mealTypes)) {
        const mealSection = document.createElement('div');
        mealSection.className = 'meal-section';
        
        const typeMeals = meals.filter(m => m.mealType === type);
        
        mealSection.innerHTML = `
            <div class="meal-header">
                <div class="meal-time">${info.name} - ${info.time}</div>
                <button class="add-btn" onclick="openAddModal('${type}')">+ Dodaj</button>
            </div>
            <div class="meal-items" id="meals-${type}">
                ${typeMeals.length === 0 ? '<div style="padding: 15px; text-align: center; color: #999;">Brak posiłków</div>' : ''}
            </div>
        `;
        
        diaryEl.appendChild(mealSection);
        
        if (typeMeals.length > 0) {
            const itemsContainer = mealSection.querySelector(`#meals-${type}`);
            itemsContainer.innerHTML = '';
            
            typeMeals.forEach(meal => {
                const item = document.createElement('div');
                item.className = 'meal-item';
                item.innerHTML = `
                    <div class="item-info">
                        <div class="item-name">${meal.name}</div>
                        <div class="item-details">
                            ${Math.round(meal.kcal)} kcal | W:${Math.round(meal.carbs)}g | B:${Math.round(meal.protein)}g | T:${Math.round(meal.fat)}g
                        </div>
                    </div>
                    <button class="remove-btn" onclick="removeMeal(${meal.id})">🗑️</button>
                `;
                itemsContainer.appendChild(item);
            });
        }
    }
    
    await updateStats();
}

// Update statistics  
async function updateStats() {
    const meals = await getTodayMeals();
    const settings = await loadSettings();
    
    const totals = meals.reduce((acc, meal) => {
        acc.kcal += meal.kcal;
        acc.carbs += meal.carbs;
        acc.protein += meal.protein;
        acc.fat += meal.fat;
        return acc;
    }, { kcal: 0, carbs: 0, protein: 0, fat: 0 });
    
    document.getElementById('totalKcal').textContent = Math.round(totals.kcal);
    document.getElementById('totalCarbs').textContent = Math.round(totals.carbs);
    document.getElementById('totalProtein').textContent = Math.round(totals.protein);
    document.getElementById('totalFat').textContent = Math.round(totals.fat);
    
    document.getElementById('targetKcal').textContent = settings.dailyCalories;
    document.getElementById('targetCarbs').textContent = settings.dailyCarbs;
    document.getElementById('targetProtein').textContent = settings.dailyProtein;
    document.getElementById('targetFat').textContent = settings.dailyFat;
    
    const kcalPercent = Math.min((totals.kcal / settings.dailyCalories) * 100, 100);
    const carbsPercent = Math.min((totals.carbs / settings.dailyCarbs) * 100, 100);
    const proteinPercent = Math.min((totals.protein / settings.dailyProtein) * 100, 100);
    const fatPercent = Math.min((totals.fat / settings.dailyFat) * 100, 100);
    
    const kcalProgress = document.getElementById('kcalProgress');
    kcalProgress.style.width = kcalPercent + '%';
    if (kcalPercent >= 90) {
        kcalProgress.classList.add('warning');
    } else {
        kcalProgress.classList.remove('warning');
    }
    
    document.getElementById('carbsProgress').style.width = carbsPercent + '%';
    document.getElementById('proteinProgress').style.width = proteinPercent + '%';
    document.getElementById('fatProgress').style.width = fatPercent + '%';
    
    const warningEl = document.getElementById('warningAlert');
    if (kcalPercent >= 90) {
        warningEl.classList.remove('hidden');
        if (kcalPercent >= 100) {
            warningEl.textContent = '🚨 Przekroczyłeś dzienny limit kalorii!';
        } else {
            warningEl.textContent = '⚠️ Zbliżasz się do dziennego limitu kalorii!';
        }
    } else {
        warningEl.classList.add('hidden');
    }
}

// Navigation
function switchTab(tab) {
    currentView = tab;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.nav-btn').classList.add('active');
    
    document.getElementById('diaryView').classList.toggle('hidden', tab !== 'diary');
    document.getElementById('settingsView').classList.toggle('hidden', tab !== 'settings');
    
    if (tab === 'add') {
        openAddModal('breakfast');
    }
}

// Modal management
function openAddModal(mealType) {
    currentMealType = mealType;
    document.getElementById('addModal').classList.add('active');
    switchModalTab('ready');
    renderReadyMeals();
}

function closeModal() {
    document.getElementById('addModal').classList.remove('active');
    selectedFood = null;
    document.getElementById('portionSelector').classList.add('hidden');
}

function switchModalTab(tab) {
    currentModalTab = tab;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.getElementById('readyMealsTab').classList.toggle('hidden', tab !== 'ready');
    document.getElementById('productsTab').classList.toggle('hidden', tab !== 'products');
    document.getElementById('aiTab').classList.toggle('hidden', tab !== 'ai');
    
    if (tab === 'products') {
        renderCategories();
        renderProducts();
    } else if (tab === 'ai') {
        document.getElementById('aiInput').value = '';
        document.getElementById('aiResults').classList.add('hidden');
        document.getElementById('aiLoading').classList.add('hidden');
    }
}

// Render ready meals
function renderReadyMeals() {
    const list = document.getElementById('readyMealsList');
    list.innerHTML = '';
    
    READY_MEALS.forEach(meal => {
        const item = document.createElement('div');
        item.className = 'food-item';
        item.onclick = () => addReadyMeal(meal);
        item.innerHTML = `
            <div class="food-name">${meal.name}</div>
            <div style="font-size: 0.85em; color: #666; margin: 4px 0;">${meal.ingredients}</div>
            <div class="food-nutrition">
                ${meal.kcal} kcal | W:${meal.carbs}g | B:${meal.protein}g | T:${meal.fat}g
            </div>
        `;
        list.appendChild(item);
    });
}

async function addReadyMeal(meal) {
    await addMeal({
        mealType: currentMealType,
        name: meal.name,
        kcal: meal.kcal,
        carbs: meal.carbs,
        protein: meal.protein,
        fat: meal.fat
    });
    
    closeModal();
    await renderDiary();
}

// Render products
function renderCategories() {
    const container = document.getElementById('categoryTabs');
    container.innerHTML = '';
    
    for (const category in FOOD_DATABASE) {
        const btn = document.createElement('button');
        btn.className = 'category-tab';
        if (category === selectedCategory) {
            btn.classList.add('active');
        }
        btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        btn.onclick = () => {
            selectedCategory = category;
            renderCategories();
            renderProducts();
        };
        container.appendChild(btn);
    }
}

function renderProducts() {
    const list = document.getElementById('productsList');
    const search = document.getElementById('searchBox').value.toLowerCase();
    list.innerHTML = '';
    
    const products = FOOD_DATABASE[selectedCategory] || [];
    const filtered = products.filter(p => p.name.toLowerCase().includes(search));
    
    filtered.forEach(product => {
        const item = document.createEl
