// Diet Tracker PWA - AI Functions Module
// This file contains AI food recognition functionality

// AI Food Recognition
let aiRecognizedItems = [];

async function analyzeFood() {
    const input = document.getElementById('aiInput').value.trim();
    
    if (!input) {
        alert('⚠️ Proszę opisać co zjadłeś!');
        return;
    }
    
    document.getElementById('aiLoading').classList.remove('hidden');
    document.getElementById('aiResults').classList.add('hidden');
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `Jestem aplikacją diet tracker. Użytkownik powiedział: "${input}"

Rozpoznaj wszystkie produkty spożywcze i oszacuj ich gramatury. Zwróć TYLKO JSON w tym formacie (bez żadnego dodatkowego tekstu):
{
  "items": [
    {"name": "nazwa produktu", "grams": liczba_gramów, "kcal": kalorie_na_100g, "carbs": węglowodany_na_100g, "protein": białko_na_100g, "fat": tłuszcze_na_100g}
  ]
}

Używaj standardowych wartości odżywczych dla polskich produktów. Jeśli użytkownik nie podał gramów, oszacuj rozsądną porcję.`
                }]
            })
        });

        const data = await response.json();
        
        document.getElementById('aiLoading').classList.add('hidden');
        
        if (!data.content || !data.content[0]) {
            throw new Error('Nieprawidłowa odpowiedź API');
        }
        
        const text = data.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error('Nie udało się rozpoznać produktów');
        }
        
        const result = JSON.parse(jsonMatch[0]);
        aiRecognizedItems = result.items || [];
        
        if (aiRecognizedItems.length === 0) {
            alert('⚠️ Nie rozpoznano żadnych produktów. Spróbuj opisać dokładniej.');
            return;
        }
        
        displayAiResults();
        
    } catch (error) {
        console.error('AI Analysis error:', error);
        document.getElementById('aiLoading').classList.add('hidden');
        alert('❌ Błąd rozpoznawania. Spróbuj ponownie lub dodaj produkty ręcznie.');
    }
}

function displayAiResults() {
    const resultsList = document.getElementById('aiResultsList');
    resultsList.innerHTML = '';
    
    let totalKcal = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    
    aiRecognizedItems.forEach((item, index) => {
        const multiplier = item.grams / 100;
        const itemKcal = item.kcal * multiplier;
        const itemCarbs = item.carbs * multiplier;
        const itemProtein = item.protein * multiplier;
        const itemFat = item.fat * multiplier;
        
        totalKcal += itemKcal;
        totalCarbs += itemCarbs;
        totalProtein += itemProtein;
        totalFat += itemFat;
        
        const itemEl = document.createElement('div');
        itemEl.style.cssText = 'padding: 10px; background: white; border-radius: 8px; margin-bottom: 10px;';
        itemEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <strong>${item.name}</strong> (${item.grams}g)<br>
                    <span style="font-size: 0.9em; color: #666;">
                        ${Math.round(itemKcal)} kcal | W:${Math.round(itemCarbs)}g | B:${Math.round(itemProtein)}g | T:${Math.round(itemFat)}g
                    </span>
                </div>
                <button onclick="removeAiItem(${index})" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">🗑️</button>
            </div>
        `;
        resultsList.appendChild(itemEl);
    });
    
    document.getElementById('aiTotalKcal').textContent = Math.round(totalKcal) + ' kcal';
    document.getElementById('aiTotalCarbs').textContent = Math.round(totalCarbs);
    document.getElementById('aiTotalProtein').textContent = Math.round(totalProtein);
    document.getElementById('aiTotalFat').textContent = Math.round(totalFat);
    
    document.getElementById('aiResults').classList.remove('hidden');
}

function removeAiItem(index) {
    aiRecognizedItems.splice(index, 1);
    if (aiRecognizedItems.length === 0) {
        document.getElementById('aiResults').classList.add('hidden');
    } else {
        displayAiResults();
    }
}

async function confirmAiMeal() {
    if (aiRecognizedItems.length === 0) {
        return;
    }
    
    let totalKcal = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    
    const itemNames = [];
    
    aiRecognizedItems.forEach(item => {
        const multiplier = item.grams / 100;
        totalKcal += item.kcal * multiplier;
        totalCarbs += item.carbs * multiplier;
        totalProtein += item.protein * multiplier;
        totalFat += item.fat * multiplier;
        itemNames.push(`${item.name} ${item.grams}g`);
    });
    
    await addMeal({
        mealType: currentMealType,
        name: itemNames.join(', '),
        kcal: totalKcal,
        carbs: totalCarbs,
        protein: totalProtein,
        fat: totalFat
    });
    
    aiRecognizedItems = [];
    document.getElementById('aiInput').value = '';
    document.getElementById('aiResults').classList.add('hidden');
    closeModal();
    await renderDiary();
}

console.log('✅ AI Module loaded successfully');
