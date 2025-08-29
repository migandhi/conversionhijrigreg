document.addEventListener('DOMContentLoaded', () => {

    // --- Element References ---
    const gregorianDateInput = document.getElementById('gregorian-date');
    const gToHButton = document.getElementById('gregorian-to-hijri-btn');
    const gToHResult = document.getElementById('gregorian-to-hijri-result');

    const hijriDayInput = document.getElementById('hijri-day');
    const hijriMonthSelect = document.getElementById('hijri-month');
    const hijriYearInput = document.getElementById('hijri-year');
    const hToGButton = document.getElementById('hijri-to-gregorian-btn');
    const hToGResult = document.getElementById('hijri-to-gregorian-result');

    // --- Initialization ---

    // Set default Gregorian date to today
    if (gregorianDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        gregorianDateInput.value = `${year}-${month}-${day}`;
    }

    // Populate Hijri month dropdown
    if (hijriMonthSelect) {
        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = i; // 0-indexed for the library
            option.textContent = HijriDate.getMonthName(i);
            hijriMonthSelect.appendChild(option);
        }
    }
    
    // --- Conversion Functions ---

    function convertGregorianToHijri() {
        const gDateValue = gregorianDateInput.value;
        if (!gDateValue) {
            gToHResult.innerHTML = `<p class="error">Please select a valid Gregorian date.</p>`;
            return;
        }

        // Create a date object ensuring it's treated as local time
        const [year, month, day] = gDateValue.split('-').map(Number);
        const gDate = new Date(year, month - 1, day);

        const hDate = HijriDate.fromGregorian(gDate);
        
        const hijriDay = hDate.getDate();
        const hijriMonthName = HijriDate.getMonthName(hDate.getMonth());
        const hijriYear = hDate.getYear();

        gToHResult.innerHTML = `<p>${hijriDay} ${hijriMonthName} ${hijriYear} H</p>`;
    }

    function convertHijriToGregorian() {
        const hDay = parseInt(hijriDayInput.value, 10);
        const hMonth = parseInt(hijriMonthSelect.value, 10); // Already 0-indexed
        const hYear = parseInt(hijriYearInput.value, 10);

        if (!hDay || !hYear || isNaN(hMonth)) {
            hToGResult.innerHTML = `<p class="error">Please enter a valid Hijri day, month, and year.</p>`;
            return;
        }

        // Basic validation
        const maxDays = HijriDate.daysInMonth(hYear, hMonth);
        if (hDay < 1 || hDay > maxDays) {
            hToGResult.innerHTML = `<p class="error">Invalid day. This month has ${maxDays} days.</p>`;
            return;
        }

        const hDate = new HijriDate(hYear, hMonth, hDay);
        const gDate = hDate.toGregorian();

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        hToGResult.innerHTML = `<p>${gDate.toLocaleDateString('en-US', options)}</p>`;
    }

    // --- Event Listeners ---
    if (gToHButton) {
        gToHButton.addEventListener('click', convertGregorianToHijri);
    }

    if (hToGButton) {
        hToGButton.addEventListener('click', convertHijriToGregorian);
    }
});