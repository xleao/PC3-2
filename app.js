// ----------------------------------------------------
// STATE & MOCK DATABASE
// ----------------------------------------------------
const state = {
    activeRole: 'gerente', // Default role on load
    theme: 'dark',
    patients: [
        { id: 1, name: 'Sra. Paty', arrival: '9:30 AM', doctor: 'Dr. Carlos Arana', status: 'Esperando', treatment: 'Curación Estética', cost: 280 },
        { id: 2, name: 'Sr. Jorge', arrival: '10:15 AM', doctor: 'Dr. Oscar Sánchez', status: 'Esperando', treatment: 'Control de Brackets', cost: 150 },
        { id: 3, name: 'Sra. Elena', arrival: '11:00 AM', doctor: 'Dr. Carlos Arana', status: 'En Box', treatment: 'Curación Estética', cost: 280 },
        { id: 4, name: 'Sr. Luis', arrival: '11:15 AM', doctor: 'Dr. Carlos Mendoza', status: 'Pendiente Pago', treatment: 'Endodoncia Molar', cost: 450 },
        { id: 5, name: 'Sra. Carmen', arrival: '11:30 AM', doctor: 'Dr. Carlos Mendoza', status: 'Confirmando cita', treatment: 'Evaluación General', cost: 50 }
    ],
    boxes: [
        { id: 1, name: 'Box 1', doctor: 'Dr. Carlos Mendoza', patient: '-', status: 'Libre', time: '-' },
        { id: 2, name: 'Box 2', doctor: 'Dr. Carlos Arana', patient: 'Sra. Elena', status: 'Ocupado', time: '20 min' },
        { id: 3, name: 'Box 3', doctor: '-', patient: '-', status: 'Limpieza', time: '-' },
        { id: 4, name: 'Box 4', doctor: '-', patient: '-', status: 'Libre', time: '-' },
        { id: 5, name: 'Box 5', doctor: 'Dr. Carlos Mendoza', patient: 'Sr. Luis', status: 'Ocupado', time: '10 min' },
        { id: 6, name: 'Box 6', doctor: '-', patient: '-', status: 'Limpieza', time: '-' }
    ],
    notifications: [
        { id: 1, from: 'Dr. Carlos Arana (Box 2)', text: 'necesita resina A2', time: '10:05 AM', confirmed: false },
        { id: 2, from: 'Box 1', text: 'Box libre, llama siguiente paciente', time: '10:15 AM', confirmed: false },
        { id: 3, from: 'Box 3 (Limpieza)', text: 'Limpieza terminada en Box 3', time: '10:20 AM', confirmed: false }
    ],
    inventory: [
        { id: 1, name: 'Resina A2', quantity: 12, unit: 'Tubo', provider: 'Surco Dental', minStock: 5, status: 'Normal' },
        { id: 2, name: 'Brackets Estéticos', quantity: 2, unit: 'Kit', provider: 'Surco Dental', minStock: 5, status: 'Crítico' },
        { id: 3, name: 'Brackets Metálicos', quantity: 8, unit: 'Kit', provider: 'Surco Dental', minStock: 4, status: 'Normal' },
        { id: 4, name: 'Guantes de Látex', quantity: 15, unit: 'Caja', provider: 'Surco Dental', minStock: 10, status: 'Normal' },
        { id: 5, name: 'Anestesia 2%', quantity: 4, unit: 'Caja', provider: 'Surco Dental', minStock: 6, status: 'Crítico' }
    ],
    comisiones: [
        { name: 'Dr. Carlos Arana', treatments: 25, type: 'Curación Estética', total: 35000, percentage: 15, commission: 5250 },
        { name: 'Dr. Carlos Mendoza', treatments: 19, type: 'Endodoncia Molar', total: 10000, percentage: 10, commission: 1000 },
        { name: 'Dr. Oscar Sánchez', treatments: 8, type: 'Cirugía Bucal', total: 10000, percentage: 15, commission: 1500 }
    ],
    cash: {
        efectivo: 1200,
        yape: 850,
        pos: 4500
    },
    // Doctor View State
    activeDoctorPatient: {
        name: 'Sra. Paty',
        age: 45,
        treatment: 'Curación Estética',
        doctor: 'Dr. Carlos Arana',
        date: '24 Oct 2025'
    },
    teethStatus: {}, // Store tooth index -> status (Caries, Corona, etc)
    // Booking Form State
    booking: {
        specialty: null,
        doctor: null,
        date: null,
        time: null,
        name: '',
        phone: '',
        email: '',
        smsConsent: true
    }
};

// Doctors list per specialty
const doctorsDb = {
    'Curación Estética': [
        { name: 'Dr. Carlos Arana', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80' },
        { name: 'Dr. Oscar Sánchez', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80' }
    ],
    'Ortodoncia': [
        { name: 'Dra. Elena Ramos', avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=100&auto=format&fit=crop&q=80' }
    ],
    'Odontopediatría': [
        { name: 'Dra. Milena Díaz', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80' }
    ],
    'Endodoncia': [
        { name: 'Dr. Carlos Mendoza', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80' }
    ],
    'Cirugía Bucal': [
        { name: 'Dr. Oscar Sánchez', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80' }
    ],
    'Implantes': [
        { name: 'Dr. Carlos Mendoza', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80' }
    ]
};

// Initial teeth statuses
for(let i=1; i<=32; i++) {
    if (i === 12 || i === 15) state.teethStatus[i] = 'Caries';
    else if (i === 5 || i === 22) state.teethStatus[i] = 'Corona';
    else if (i === 8) state.teethStatus[i] = 'Extracción';
    else if (i === 18) state.teethStatus[i] = 'Implante';
    else state.teethStatus[i] = 'Sana';
}

// User Profiles metadata
const userProfiles = {
    gerente: { name: 'Dr. Carlos Mendoza', role: 'Gerente / Director', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80' },
    recepcionista: { name: 'Milagros Vega', role: 'Recepcionista', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80' },
    doctor: { name: 'Dr. Carlos Arana', role: 'Especialista / Box 2', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80' },
    almacen: { name: 'Fiorella Solís', role: 'Almacén / Facturación', avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=100&auto=format&fit=crop&q=80' },
    contador: { name: 'Don Lucho', role: 'Contador General', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    paciente: { name: 'Sra. Paty Cruz', role: 'Paciente VIP', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }
};

// ----------------------------------------------------
// SOUND EFFECTS & PUSH SYSTEM (WEB AUDIO API BEEP)
// ----------------------------------------------------
function playBeep(type = 'success') {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'success') {
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } else if (type === 'alert') {
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'click') {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        }
    } catch(e) {
        console.log("Audio not allowed or supported yet.");
    }
}

// Show standard toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-outlet');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if(type === 'success') icon = 'fa-circle-check';
    else if(type === 'alert') icon = 'fa-triangle-exclamation';
    else if(type === 'danger') icon = 'fa-circle-xmark';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    // Play beep based on toast type
    if(type === 'alert' || type === 'danger') playBeep('alert');
    else playBeep('success');
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ----------------------------------------------------
// NAVIGATION & ROLE CONTROL
// ----------------------------------------------------
function initApp() {
    // Bind global click sounds to buttons
    document.querySelectorAll('button, .menu-item, .btn-role-quick').forEach(el => {
        el.addEventListener('click', () => playBeep('click'));
    });

    // Theme toggler
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    // Login handlers
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    document.querySelectorAll('.btn-role-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const role = e.currentTarget.getAttribute('data-role');
            document.getElementById('login-user').value = role;
            handleLogin();
        });
    });

    // Sidebar menu navigation
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            switchSubPanel(target);
        });
    });

    // Sidebar Logouts
    document.getElementById('btn-app-logout').addEventListener('click', logout);
    document.getElementById('btn-patient-logout').addEventListener('click', logout);

    // Quick demo selector
    document.querySelectorAll('#demo-role-switches .btn-demo-switch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const role = e.currentTarget.getAttribute('data-role');
            switchRole(role);
        });
    });

    // Load initial layout
    switchRole('gerente');
    logout(); // Start at login screen
    
    // Start date clock
    updateClock();
    setInterval(updateClock, 30000);

    // Initial check for WhatsApp widget setup
    document.getElementById('whatsapp-widget').addEventListener('click', () => {
        showToast("Conectando con Recepción de OdontoSan vía WhatsApp...", "success");
    });

    // Email Modal handlers
    const closeEmailBtn = document.getElementById('btn-close-email-modal');
    if (closeEmailBtn) {
        closeEmailBtn.addEventListener('click', () => {
            document.getElementById('modal-email-composer').classList.add('hidden');
        });
    }

    const sendEmailBtn = document.getElementById('btn-send-email-submit');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', () => {
            sendEmailBtn.disabled = true;
            sendEmailBtn.textContent = "Enviando...";
            document.getElementById('email-sending-progress').classList.remove('hidden');
            
            setTimeout(() => {
                document.getElementById('modal-email-composer').classList.add('hidden');
                showToast("Liquidación de comisiones enviada por correo a Don Lucho con éxito.", "success");
            }, 1500);
        });
    }
}

function updateClock() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateStr = new Date().toLocaleDateString('es-PE', options);
    const container = document.getElementById('header-date');
    if (container) container.textContent = dateStr;
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    state.theme = newTheme;
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (newTheme === 'dark') {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    showToast(`Modo ${newTheme === 'dark' ? 'Oscuro' : 'Claro'} activado`, 'info');
}

function handleLogin() {
    const role = document.getElementById('login-user').value;
    switchRole(role);
    showToast(`Bienvenido al sistema, ${userProfiles[role].name}`, 'success');
}

function logout() {
    document.getElementById('view-login').classList.remove('hidden');
    document.getElementById('view-app').classList.add('hidden');
    document.getElementById('view-patient-portal').classList.add('hidden');
    document.getElementById('whatsapp-widget').classList.remove('hidden');
}

function switchRole(role) {
    state.activeRole = role;
    
    // Update active class in demo switches
    document.querySelectorAll('#demo-role-switches .btn-demo-switch').forEach(btn => {
        if(btn.getAttribute('data-role') === role) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    // Show views based on role
    if (role === 'paciente') {
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('view-app').classList.add('hidden');
        document.getElementById('view-patient-portal').classList.remove('hidden');
        resetBookingWizard();
    } else {
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('view-app').classList.remove('hidden');
        document.getElementById('view-patient-portal').classList.add('hidden');
        
        // Update sidebar profile card
        const profile = userProfiles[role];
        document.getElementById('user-display-name').textContent = profile.name;
        document.getElementById('user-display-role').textContent = profile.role;
        document.getElementById('user-avatar').src = profile.avatar;

        // Hide/Show sidebar links depending on role (RBAC)
        configureSidebarForRole(role);

        // Go to default view for this role
        const defaultViews = {
            gerente: 'dashboard',
            recepcionista: 'citas',
            doctor: 'fichas',
            almacen: 'inventario',
            contador: 'comisiones'
        };
        switchSubPanel(defaultViews[role]);
    }
}

function configureSidebarForRole(role) {
    // Show all items first
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        item.classList.remove('hidden');
    });

    // Apply filters
    if (role === 'recepcionista') {
        // Milagros sees Citas, Comunicacion Interna, Caja
        hideSidebarItem('menu-dashboard');
        hideSidebarItem('menu-fichas');
        hideSidebarItem('menu-inventario');
        hideSidebarItem('menu-comisiones');
        hideSidebarItem('menu-reportes');
        hideSidebarItem('menu-rrhh');
    } else if (role === 'doctor') {
        // Doctors see Fichas, Comunicacion
        hideSidebarItem('menu-dashboard');
        hideSidebarItem('menu-citas');
        hideSidebarItem('menu-inventario');
        hideSidebarItem('menu-caja');
        hideSidebarItem('menu-comisiones');
        hideSidebarItem('menu-reportes');
        hideSidebarItem('menu-rrhh');
    } else if (role === 'almacen') {
        // Fiorella sees Inventario, Caja
        hideSidebarItem('menu-dashboard');
        hideSidebarItem('menu-citas');
        hideSidebarItem('menu-fichas');
        hideSidebarItem('menu-comunicacion');
        hideSidebarItem('menu-comisiones');
        hideSidebarItem('menu-reportes');
        hideSidebarItem('menu-rrhh');
    } else if (role === 'contador') {
        // Don Lucho sees Comisiones, Reportes
        hideSidebarItem('menu-dashboard');
        hideSidebarItem('menu-citas');
        hideSidebarItem('menu-fichas');
        hideSidebarItem('menu-comunicacion');
        hideSidebarItem('menu-inventario');
        hideSidebarItem('menu-caja');
        hideSidebarItem('menu-rrhh');
    }
    // Gerente sees everything (no hiding)
}

function hideSidebarItem(id) {
    const el = document.getElementById(id);
    if(el) el.classList.add('hidden');
}

function switchSubPanel(target) {
    // Active class styling
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
        if(item.getAttribute('data-target') === target) item.classList.add('active');
        else item.classList.remove('active');
    });

    // Update Header title
    const titles = {
        dashboard: 'Dashboard Ejecutivo (Gerente)',
        citas: 'Panel de Citas y Recepción',
        fichas: 'Ficha Clínica & Box Digital',
        comunicacion: 'Bandeja de Notificaciones del Equipo',
        inventario: 'Gestión de Almacén e Inventario',
        caja: 'Caja y Facturación',
        comisiones: 'Módulo Contable de Comisiones',
        reportes: 'Reportes y Analítica',
        rrhh: 'Gestión de Recursos Humanos'
    };
    
    document.getElementById('page-title').textContent = titles[target] || 'Sistema OdontoSan';

    // Load sub-panel html dynamically
    const container = document.getElementById('sub-panel-content');
    
    // Clear notifications counts as they are viewed
    if (target === 'comunicacion') {
        document.getElementById('internal-noti-badge').classList.add('hidden');
    }

    if (target === 'dashboard') {
        renderDashboard(container);
    } else if (target === 'citas') {
        renderReceptionPanel(container);
    } else if (target === 'fichas') {
        renderDoctorPanel(container);
    } else if (target === 'comunicacion') {
        renderCommunicationPanel(container);
    } else if (target === 'inventario') {
        renderInventoryPanel(container);
    } else if (target === 'caja') {
        renderCashRegisterPanel(container);
    } else if (target === 'comisiones') {
        renderComisionesPanel(container);
    } else {
        container.innerHTML = `
            <div class="card animate-fade-in" style="text-align: center; padding: 50px;">
                <i class="fa-solid fa-screwdriver-wrench" style="font-size: 40px; color: var(--primary); margin-bottom: 15px;"></i>
                <h3>Módulo en Mantenimiento</h3>
                <p style="color: var(--text-secondary); margin-top: 10px;">Este módulo se encuentra configurado en la nube de OdontoSan y está listo para integrarse en la Fase 3 de la Hoja de Ruta.</p>
            </div>
        `;
    }
}

// ----------------------------------------------------
// VIEW RENDERING: GERENTE (DASHBOARD)
// ----------------------------------------------------
function renderDashboard(container) {
    // Calculate stats
    const todayCitas = state.patients.length + 13; // dummy aggregate
    const criticalStock = state.inventory.filter(i => i.status === 'Crítico').length;
    const activeBoxes = state.boxes.filter(b => b.status === 'Ocupado').length;
    const totalEarnings = state.cash.efectivo + state.cash.yape + state.cash.pos;

    let criticalStockBanner = '';
    const firstCritical = state.inventory.find(i => i.status === 'Crítico');
    if (firstCritical) {
        criticalStockBanner = `
            <div class="alert-banner warning">
                <div class="alert-content-wrapper">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <div>
                        <div class="alert-title">Stock Crítico en Almacén</div>
                        <div class="alert-desc">Quedan pocas unidades de <strong>${firstCritical.name}</strong> (${firstCritical.quantity} restantes).</div>
                    </div>
                </div>
                <button class="btn-alert-action" onclick="replenishItem(${firstCritical.id})">Generar Compra</button>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="animate-fade-in">
            ${criticalStockBanner}
            
            <!-- KPI CARDS -->
            <div class="grid-4">
                <div class="card kpi-card">
                    <div class="kpi-left">
                        <h4>Citas de Hoy</h4>
                        <div class="kpi-value">${todayCitas}</div>
                        <div class="kpi-sub">12 Atendidas | 6 Pendientes</div>
                    </div>
                    <div class="kpi-icon primary"><i class="fa-solid fa-calendar-day"></i></div>
                </div>
                <div class="card kpi-card">
                    <div class="kpi-left">
                        <h4>Ingresos del Día</h4>
                        <div class="kpi-value">S/. ${totalEarnings}</div>
                        <div class="kpi-sub">Efectivo: S/. ${state.cash.efectivo} | POS: S/. ${state.cash.pos}</div>
                    </div>
                    <div class="kpi-icon success"><i class="fa-solid fa-wallet"></i></div>
                </div>
                <div class="card kpi-card">
                    <div class="kpi-left">
                        <h4>Insumos Críticos</h4>
                        <div class="kpi-value">${criticalStock}</div>
                        <div class="kpi-sub">Faltan brackets y anestesia</div>
                    </div>
                    <div class="kpi-icon alert"><i class="fa-solid fa-box-open"></i></div>
                </div>
                <div class="card kpi-card">
                    <div class="kpi-left">
                        <h4>Ocupación de Boxes</h4>
                        <div class="kpi-value">${activeBoxes}/6</div>
                        <div class="kpi-sub">${Math.round((activeBoxes/6)*100)}% de boxes en uso</div>
                    </div>
                    <div class="kpi-icon secondary"><i class="fa-solid fa-door-open"></i></div>
                </div>
            </div>

            <div class="grid-2-1">
                <!-- BOX MAP -->
                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-grip"></i> Estado de los Boxes en Tiempo Real</h3>
                        <span style="font-size: 11px; color: var(--text-muted);">Ubicación: Jesús María</span>
                    </div>
                    <div class="boxes-grid">
                        ${state.boxes.map(box => `
                            <div class="box-card ${box.status.toLowerCase()}">
                                <div class="box-header">
                                    <span class="box-name">${box.name}</span>
                                    <span class="box-status-tag">${box.status}</span>
                                </div>
                                <div class="box-body">
                                    <div class="box-doctor"><i class="fa-solid fa-user-doctor"></i> ${box.doctor}</div>
                                    <div class="box-patient"><i class="fa-solid fa-hospital-user"></i> Paciente: ${box.patient}</div>
                                </div>
                                <div class="box-footer">
                                    <span>${box.status === 'Ocupado' ? `Restan: ${box.time}` : 'Disponible'}</span>
                                    <span class="box-pulse"></span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- ANALYTICS / CHART -->
                <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-chart-bar"></i> Flujo de Facturación (Por Hora)</h3>
                    </div>
                    
                    <div class="chart-bar-container">
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 40px;"></div><span class="chart-label">8am</span></div>
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 70px;"></div><span class="chart-label">9am</span></div>
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 60px;"></div><span class="chart-label">10am</span></div>
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 120px;"></div><span class="chart-label">11am</span></div>
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 110px;"></div><span class="chart-label">12pm</span></div>
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 30px;"></div><span class="chart-label">1pm</span></div>
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 50px;"></div><span class="chart-label">2pm</span></div>
                        <div class="chart-bar-col"><div class="chart-bar" style="height: 20px;"></div><span class="chart-label">3pm</span></div>
                    </div>
                    
                    <div style="border-top: 1px solid var(--border); padding-top: 15px; margin-top: 15px; font-size: 12px; color: var(--text-secondary); display:flex; justify-content:space-between;">
                        <span>Pico Máximo: 11:00 AM</span>
                        <strong style="color: white;">Total Consolidado: S/. ${totalEarnings}</strong>
                    </div>
                </div>
            </div>

            <!-- WAITLIST & ALERTS -->
            <div class="grid-2-1" style="grid-template-columns: 1fr 1fr;">
                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-chair"></i> Sala de Espera Activa</h3>
                    </div>
                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Llegada</th>
                                    <th>Doctor</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.patients.slice(0, 4).map(p => `
                                    <tr>
                                        <td style="font-weight:600; color: var(--text-primary);">${p.name}</td>
                                        <td>${p.arrival}</td>
                                        <td>${p.doctor}</td>
                                        <td><span class="badge ${p.status === 'Esperando' ? 'badge-waiting' : p.status === 'En Box' ? 'badge-inbox' : 'badge-unpaid'}">${p.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-triangle-exclamation"></i> Alertas y Sucesos Recientes</h3>
                    </div>
                    <div class="notification-tray" style="max-height: 250px;">
                        <div class="notification-bubble" style="border-left: 3px solid var(--danger);">
                            <div class="noti-icon" style="background:rgba(239,68,68,0.1); color:var(--danger);"><i class="fa-solid fa-bug"></i></div>
                            <div class="noti-body">
                                <div class="noti-meta"><span class="noti-sender">Sistema de Alerta</span><span>Hace 5 min</span></div>
                                <div class="noti-text">Faltan brackets estéticos en almacén. Don Lucho solicitó reprogramar citas de Ortodoncia.</div>
                            </div>
                        </div>
                        <div class="notification-bubble" style="border-left: 3px solid var(--alert);">
                            <div class="noti-icon"><i class="fa-solid fa-circle-exclamation"></i></div>
                            <div class="noti-body">
                                <div class="noti-meta"><span class="noti-sender">Milagros (Recepción)</span><span>Hace 15 min</span></div>
                                <div class="noti-text">Se canceló cita de la Sra. Garcia por demora en el POS de cobro de Yape.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Replenish from dashboard alert
window.replenishItem = function(id) {
    const item = state.inventory.find(i => i.id === id);
    if(item) {
        item.quantity = 15;
        item.status = 'Normal';
        showToast(`Orden enviada al proveedor de Surco. Se repuso ${item.name} a 15 unidades.`, "success");
        if(state.activeRole === 'gerente') switchSubPanel('dashboard');
        else if(state.activeRole === 'almacen') switchSubPanel('inventario');
    }
};

// ----------------------------------------------------
// VIEW RENDERING: RECEPCIONISTA (MILAGROS PANEL)
// ----------------------------------------------------
function renderReceptionPanel(container) {
    container.innerHTML = `
        <div class="animate-fade-in grid-2-1" style="grid-template-columns: 1fr 1fr; gap: 20px;">
            
            <!-- LEFT: WAITLIST & CASH REGISTER INFO -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card" style="flex-grow:1;">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-users"></i> Sala de Espera Activa</h3>
                        <span style="font-size:11px; color:var(--text-muted);">Haz clic en el estado para cambiarlo</span>
                    </div>
                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Llegada</th>
                                    <th>Doctor</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody id="reception-waitlist-body">
                                ${state.patients.map(p => `
                                    <tr class="${p.status === 'Pendiente Pago' ? 'highlight' : ''}" onclick="handlePatientRowClick(${p.id})">
                                        <td style="font-weight:600; color: var(--text-primary);">${p.name}</td>
                                        <td>${p.arrival}</td>
                                        <td>${p.doctor}</td>
                                        <td>
                                            <span class="badge ${p.status === 'Esperando' ? 'badge-waiting' : p.status === 'En Box' ? 'badge-inbox' : 'badge-unpaid'}" style="cursor:pointer;">
                                                ${p.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-cash-register"></i> Resumen de Caja y Liquidación Diaria</h3>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom: 15px;">
                        <div style="background:var(--bg-main); border:1px solid var(--border); padding:10px; border-radius: var(--radius-sm); text-align:center;">
                            <span style="font-size:10px; color:var(--text-muted); display:block; text-transform:uppercase;">Efectivo</span>
                            <strong style="font-size:15px; color: var(--text-primary);">S/. ${state.cash.efectivo}</strong>
                        </div>
                        <div style="background:var(--bg-main); border:1px solid var(--border); padding:10px; border-radius: var(--radius-sm); text-align:center;">
                            <span style="font-size:10px; color:var(--text-muted); display:block; text-transform:uppercase;">Yape</span>
                            <strong style="font-size:15px; color: var(--text-primary);">S/. ${state.cash.yape}</strong>
                        </div>
                        <div style="background:var(--bg-main); border:1px solid var(--border); padding:10px; border-radius: var(--radius-sm); text-align:center;">
                            <span style="font-size:10px; color:var(--text-muted); display:block; text-transform:uppercase;">POS Visa</span>
                            <strong style="font-size:15px; color: var(--text-primary);">S/. ${state.cash.pos}</strong>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px;">
                        <span style="font-size:12px; color:var(--text-secondary);">Total Acumulado en Caja:</span>
                        <strong style="font-size:18px; color:var(--success);">S/. ${state.cash.efectivo + state.cash.yape + state.cash.pos}</strong>
                    </div>
                </div>
            </div>

            <!-- RIGHT: BOXES & PUSH NOTIFICATIONS -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-door-closed"></i> Estado de los Boxes clínicos</h3>
                    </div>
                    <div class="boxes-grid" style="grid-template-columns:1fr 1fr;">
                        ${state.boxes.map(box => `
                            <div class="box-card ${box.status.toLowerCase()}" onclick="toggleBoxState(${box.id})">
                                <div class="box-header">
                                    <span class="box-name">${box.name}</span>
                                    <span class="box-status-tag">${box.status}</span>
                                </div>
                                <div class="box-body" style="margin-top:6px;">
                                    <div class="box-doctor" style="font-size:11px;">Doc: ${box.doctor}</div>
                                    <div class="box-patient" style="font-size:10px;">Pac: ${box.patient}</div>
                                </div>
                                <div class="box-footer">
                                    <span class="box-pulse"></span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-bell-concierge"></i> Notificaciones Recibidas del Box</h3>
                    </div>
                    <div class="notification-tray" id="reception-notification-tray">
                        ${state.notifications.filter(n => !n.confirmed).length === 0 ? `
                            <div style="text-align:center; padding: 25px; color: var(--text-muted); font-size:12px;">
                                <i class="fa-solid fa-check-double" style="font-size:24px; color: var(--success); margin-bottom: 8px;"></i>
                                <p>No hay alertas pendientes en la cola.</p>
                            </div>
                        ` : state.notifications.filter(n => !n.confirmed).map(notif => `
                            <div class="notification-bubble animate-fade-in" id="noti-bubble-${notif.id}">
                                <div class="noti-icon"><i class="fa-solid fa-bell"></i></div>
                                <div class="noti-body">
                                    <div class="noti-meta">
                                        <span class="noti-sender">${notif.from}</span>
                                        <span>${notif.time}</span>
                                    </div>
                                    <div class="noti-text"><strong>Solicitud:</strong> ${notif.text}</div>
                                    <div class="noti-actions">
                                        <button class="btn-noti-confirm" onclick="confirmNotification(${notif.id})">
                                            <i class="fa-solid fa-check"></i> Entendido / Recibido
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

        </div>
    `;
}

// Sola de espera click handler
window.handlePatientRowClick = function(id) {
    const patient = state.patients.find(p => p.id === id);
    if (!patient) return;
    
    if (patient.status === 'Pendiente Pago') {
        openCheckoutModal(patient);
    } else {
        // Toggle status Cycle: Esperando -> En Box -> Pendiente Pago -> Esperando
        if (patient.status === 'Esperando') {
            patient.status = 'En Box';
            // Also assign box 2 to patient
            const b2 = state.boxes.find(b => b.id === 2);
            if(b2) { b2.patient = patient.name; b2.status = 'Ocupado'; b2.doctor = patient.doctor; }
            showToast(`${patient.name} ingresó al consultorio clínico`, 'success');
        } else if (patient.status === 'En Box') {
            patient.status = 'Pendiente Pago';
            const b2 = state.boxes.find(b => b.id === 2);
            if(b2) { b2.patient = '-'; b2.status = 'Limpieza'; b2.doctor = '-'; }
            showToast(`${patient.name} terminó tratamiento. Pasa a Caja para cancelar.`, 'alert');
        } else {
            patient.status = 'Esperando';
        }
        renderReceptionPanel(document.getElementById('sub-panel-content'));
    }
};

// Box State toggle by clicking
window.toggleBoxState = function(id) {
    const box = state.boxes.find(b => b.id === id);
    if(box) {
        if(box.status === 'Libre') {
            box.status = 'Ocupado';
            box.doctor = 'Dr. Carlos Arana';
            box.patient = 'Sra. Elena';
        } else if(box.status === 'Ocupado') {
            box.status = 'Limpieza';
            box.doctor = '-';
            box.patient = '-';
        } else {
            box.status = 'Libre';
            box.doctor = '-';
            box.patient = '-';
        }
        showToast(`Estado de ${box.name} cambiado a ${box.status}`, 'info');
        renderReceptionPanel(document.getElementById('sub-panel-content'));
    }
};

// Confirm internal team notif
window.confirmNotification = function(id) {
    const notif = state.notifications.find(n => n.id === id);
    if (notif) {
        notif.confirmed = true;
        const bubble = document.getElementById(`noti-bubble-${id}`);
        if(bubble) {
            bubble.style.animation = 'slideInRight 0.3s reverse';
            setTimeout(() => {
                renderReceptionPanel(document.getElementById('sub-panel-content'));
                showToast("Notificación confirmada", "success");
            }, 300);
        }
    }
};

// ----------------------------------------------------
// COBRO MIXTO MODAL (MILAGROS / CAJA)
// ----------------------------------------------------
let activeCheckoutPatient = null;

function openCheckoutModal(patient) {
    activeCheckoutPatient = patient;
    document.getElementById('checkout-pat-name').textContent = patient.name;
    document.getElementById('checkout-treatment-name').textContent = patient.treatment;
    document.getElementById('checkout-doc-name').textContent = patient.doctor;
    document.getElementById('checkout-cost-total').value = `S/. ${patient.cost.toFixed(2)}`;
    
    // Reset payment fields
    document.getElementById('pay-cash').value = 0;
    document.getElementById('pay-yape').value = 0;
    document.getElementById('pay-pos').value = 0;
    
    updateCheckoutMath();
    
    document.getElementById('modal-checkout-pay').classList.remove('hidden');

    // Register mathematical calculation event listeners
    const inputs = ['pay-cash', 'pay-yape', 'pay-pos'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.oninput = updateCheckoutMath;
        el.onfocus = () => { if(el.value === '0') el.value = ''; };
        el.onblur = () => { if(el.value === '') el.value = '0'; };
    });
}

function updateCheckoutMath() {
    if(!activeCheckoutPatient) return;
    
    const cash = parseFloat(document.getElementById('pay-cash').value) || 0;
    const yape = parseFloat(document.getElementById('pay-yape').value) || 0;
    const pos = parseFloat(document.getElementById('pay-pos').value) || 0;
    
    const totalInput = cash + yape + pos;
    const target = activeCheckoutPatient.cost;
    
    document.getElementById('checkout-sum-registered').textContent = `S/. ${totalInput.toFixed(2)}`;
    
    const remainingVal = target - totalInput;
    const submitBtn = document.getElementById('btn-submit-pay-checkout');
    
    if (remainingVal > 0) {
        // Underpaid
        document.getElementById('checkout-sum-remaining-row').classList.remove('hidden');
        document.getElementById('checkout-sum-match-row').classList.add('hidden');
        document.getElementById('checkout-sum-error-row').classList.add('hidden');
        
        document.getElementById('checkout-sum-remaining').textContent = `S/. ${remainingVal.toFixed(2)}`;
        document.getElementById('checkout-sum-remaining').style.color = 'var(--danger)';
        submitBtn.disabled = true;
    } else if (remainingVal === 0) {
        // Matches perfectly
        document.getElementById('checkout-sum-remaining-row').classList.add('hidden');
        document.getElementById('checkout-sum-match-row').classList.remove('hidden');
        document.getElementById('checkout-sum-error-row').classList.add('hidden');
        submitBtn.disabled = false;
    } else {
        // Excess payment (allowed only if cash is used, count as change to be given)
        const excess = Math.abs(remainingVal);
        document.getElementById('checkout-sum-remaining-row').classList.remove('hidden');
        document.getElementById('checkout-sum-match-row').classList.add('hidden');
        document.getElementById('checkout-sum-error-row').classList.add('hidden');
        
        document.getElementById('checkout-sum-remaining').textContent = `Vuelto a entregar: S/. ${excess.toFixed(2)}`;
        document.getElementById('checkout-sum-remaining').style.color = 'var(--warning)';
        
        // If cash has enough value to cover the excess, allow checkout
        if (cash >= excess) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
            document.getElementById('checkout-sum-error-row').classList.remove('hidden');
        }
    }
}

// Save checkout
document.getElementById('btn-submit-pay-checkout').onclick = function() {
    if(!activeCheckoutPatient) return;
    
    const cash = parseFloat(document.getElementById('pay-cash').value) || 0;
    const yape = parseFloat(document.getElementById('pay-yape').value) || 0;
    const pos = parseFloat(document.getElementById('pay-pos').value) || 0;
    
    // Account for change if any
    const totalInput = cash + yape + pos;
    const excess = totalInput - activeCheckoutPatient.cost;
    const actualCashCollected = cash - (excess > 0 ? excess : 0);
    
    // Add to cash register
    state.cash.efectivo += actualCashCollected;
    state.cash.yape += yape;
    state.cash.pos += pos;
    
    // Update commission calculations for Don Lucho
    const commissionRecord = state.comisiones.find(c => c.name === activeCheckoutPatient.doctor);
    if(commissionRecord) {
        commissionRecord.treatments += 1;
        commissionRecord.total += activeCheckoutPatient.cost;
        commissionRecord.commission = Math.round(commissionRecord.total * (commissionRecord.percentage / 100));
    }
    
    // Set patient as Atendido / Paid (remove from active waiting list)
    state.patients = state.patients.filter(p => p.id !== activeCheckoutPatient.id);
    
    document.getElementById('modal-checkout-pay').classList.add('hidden');
    showToast("Cobro cerrado exitosamente. Datos sincronizados con Contabilidad.", "success");
    
    if(state.activeRole === 'recepcionista') renderReceptionPanel(document.getElementById('sub-panel-content'));
    activeCheckoutPatient = null;
};

document.getElementById('btn-close-pay-modal').onclick = function() {
    document.getElementById('modal-checkout-pay').classList.add('hidden');
    activeCheckoutPatient = null;
};

// ----------------------------------------------------
// VIEW RENDERING: DOCTOR PANEL (FICHA CLINICA + ODONTOGRAMA)
// ----------------------------------------------------
function renderDoctorPanel(container) {
    container.innerHTML = `
        <div class="animate-fade-in grid-2-1" style="grid-template-columns: 2fr 1fr; gap: 20px;">
            
            <!-- LEFT: ODONTOGRAM & CLINICAL DATA -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card">
                    <div class="card-title-header" style="margin-bottom: 12px;">
                        <h3><i class="fa-solid fa-user-injured"></i> Resumen de la Ficha del Paciente</h3>
                        <span style="font-size: 11px; color: var(--success); font-weight:700;"><i class="fa-solid fa-cloud-arrow-up"></i> Sincronizado</span>
                    </div>
                    
                    <div class="info-grid-box">
                        <div>
                            <span style="color:var(--text-muted); display:block; font-size:10px; text-transform:uppercase;">Paciente VIP</span>
                            <strong style="font-size:14px;">${state.activeDoctorPatient.name}</strong>
                        </div>
                        <div>
                            <span style="color:var(--text-muted); display:block; font-size:10px; text-transform:uppercase;">Edad</span>
                            <strong style="font-size:14px;">${state.activeDoctorPatient.age} Años</strong>
                        </div>
                        <div>
                            <span style="color:var(--text-muted); display:block; font-size:10px; text-transform:uppercase;">Saldo Pendiente</span>
                            <strong style="color:var(--success); font-size:14px;">S/. 0.00</strong>
                        </div>
                        <div>
                            <span style="color:var(--text-muted); display:block; font-size:10px; text-transform:uppercase;">Tratamiento Actual</span>
                            <strong style="font-size:13px;">${state.activeDoctorPatient.treatment}</strong>
                        </div>
                        <div>
                            <span style="color:var(--text-muted); display:block; font-size:10px; text-transform:uppercase;">Médico Responsable</span>
                            <strong style="font-size:13px;">${state.activeDoctorPatient.doctor}</strong>
                        </div>
                        <div>
                            <span style="color:var(--text-muted); display:block; font-size:10px; text-transform:uppercase;">Fecha Ingreso</span>
                            <strong style="font-size:13px;">${state.activeDoctorPatient.date}</strong>
                        </div>
                    </div>
                </div>

                <!-- ODONTOGRAM -->
                <div class="card odontogram-panel">
                    <div class="card-title-header" style="margin-bottom:0;">
                        <h3><i class="fa-solid fa-tooth"></i> Odontograma Digital Interactivo</h3>
                        <span style="font-size:11px; color:var(--text-muted);">Selecciona un diente para cambiar estado</span>
                    </div>

                    <div class="odontogram-body">
                        <!-- Top Row (1 - 16) -->
                        <div class="odontogram-row">
                            ${Array.from({ length: 16 }, (_, i) => i + 1).map(num => renderToothHTML(num)).join('')}
                        </div>
                        
                        <!-- Divider -->
                        <div style="width: 100%; height: 1px; background: var(--border); margin: 5px 0;"></div>
                        
                        <!-- Bottom Row (32 - 17) -->
                        <div class="odontogram-row">
                            ${Array.from({ length: 16 }, (_, i) => 32 - i).map(num => renderToothHTML(num)).join('')}
                        </div>
                    </div>

                    <div class="legend-grid">
                        <div class="legend-item"><span class="status-dot caries"></span> Caries</div>
                        <div class="legend-item"><span class="status-dot corona"></span> Corona</div>
                        <div class="legend-item"><span class="status-dot extraccion"></span> Extracción</div>
                        <div class="legend-item"><span class="status-dot implante"></span> Implante</div>
                        <div class="legend-item"><span class="status-dot sana"></span> Sana / Normal</div>
                    </div>
                </div>
            </div>

            <!-- RIGHT: CLINICAL NOTES & INVENTARIO CONSUMO & PAGER -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-microphone"></i> Notas Clínicas</h3>
                        <button class="btn-demo-switch" id="btn-dictate-notes" style="font-size:11px;"><i class="fa-solid fa-microphone"></i> Dictar</button>
                    </div>
                    <textarea id="clinical-notes-text" class="form-control" style="height:80px; resize:none;" placeholder="Escribe aquí las observaciones clínicas del tratamiento actual..."></textarea>
                </div>

                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-flask"></i> Insumos Utilizados</h3>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <label class="checkbox-group" style="margin-bottom:0;">
                            <input type="checkbox" id="chk-use-resina" onchange="handleInsumoCheck('Resina A2', this)">
                            <span>Descontar 1 Resina A2 (Stock: <span id="lbl-stock-resina">${state.inventory.find(i=>i.id===1).quantity}</span>)</span>
                        </label>
                        <label class="checkbox-group" style="margin-bottom:0;">
                            <input type="checkbox" id="chk-use-anestesia" onchange="handleInsumoCheck('Anestesia 2%', this)">
                            <span>Descontar 1 Anestesia 2% (Stock: <span id="lbl-stock-anestesia">${state.inventory.find(i=>i.id===5).quantity}</span>)</span>
                        </label>
                    </div>
                </div>

                <!-- CALL BUTTON -->
                <button class="btn-primary" id="btn-call-reception-modal" style="background:var(--alert); box-shadow:0 4px 15px rgba(249, 115, 22, 0.3); font-size:15px; font-weight:700; height:50px;">
                    <i class="fa-solid fa-bell-concierge"></i> NOTIFICAR A RECEPCIÓN
                </button>
            </div>

        </div>
    `;

    // Hook listeners for teeth status menus
    document.querySelectorAll('.tooth-item').forEach(tooth => {
        tooth.addEventListener('click', (e) => {
            e.stopPropagation();
            const num = tooth.getAttribute('data-num');
            openToothMenu(num, tooth);
        });
    });

    // Close menus on clicking document
    document.addEventListener('click', closeAllToothMenus);

    // Voice dictation simulation
    document.getElementById('btn-dictate-notes').onclick = function() {
        const area = document.getElementById('clinical-notes-text');
        area.value = "Dictando: ";
        showToast("Micrófono activado. Escuchando dictado médico...", "info");
        
        let words = ["Paciente", "sufre", "de", "caries", "en", "pieza", "12.", "Se", "procede", "a", "limpieza", "y", "restauración", "con", "resina", "A2.", "Tratamiento", "exitoso."];
        let i = 0;
        
        const timer = setInterval(() => {
            if(i < words.length) {
                area.value += words[i] + " ";
                i++;
                playBeep('click');
            } else {
                clearInterval(timer);
                showToast("Dictado de notas finalizado", "success");
            }
        }, 300);
    };

    // Open Doctor Pager notification modal
    document.getElementById('btn-call-reception-modal').onclick = function() {
        document.getElementById('modal-doctor-notif').classList.remove('hidden');
    };
}

// Tooth component HTML
function renderToothHTML(num) {
    const status = state.teethStatus[num] || 'Sana';
    return `
        <div class="tooth-item" data-num="${num}" data-status="${status}" id="tooth-container-${num}">
            <span class="tooth-num">${num}</span>
            <svg class="tooth-svg" viewBox="0 0 28 36">
                <!-- Outer Shape of a Tooth (Crown & Roots) -->
                <path d="M 4,12 C 4,6 8,4 14,4 C 20,4 24,6 24,12 C 24,20 22,25 21,32 C 20,33 19,34 18,34 C 17,34 15,31 14,31 C 13,31 11,34 10,34 C 9,34 8,33 7,32 C 6,25 4,20 4,12 Z" />
            </svg>
        </div>
    `;
}

// Tooth Menu
function openToothMenu(num, toothEl) {
    closeAllToothMenus();
    
    const popup = document.createElement('div');
    const isTopRow = parseInt(num) <= 16;
    popup.className = `tooth-menu-popup animate-fade-in ${isTopRow ? 'popup-down' : ''}`;
    popup.innerHTML = `
        <button class="btn-status-option" onclick="changeToothStatus(${num}, 'Sana')"><span class="status-dot sana"></span> Sana</button>
        <button class="btn-status-option" onclick="changeToothStatus(${num}, 'Caries')"><span class="status-dot caries"></span> Caries</button>
        <button class="btn-status-option" onclick="changeToothStatus(${num}, 'Corona')"><span class="status-dot corona"></span> Corona</button>
        <button class="btn-status-option" onclick="changeToothStatus(${num}, 'Extracción')"><span class="status-dot extraccion"></span> Extracción</button>
        <button class="btn-status-option" onclick="changeToothStatus(${num}, 'Implante')"><span class="status-dot implante"></span> Implante</button>
    `;
    toothEl.appendChild(popup);
}

function closeAllToothMenus() {
    document.querySelectorAll('.tooth-menu-popup').forEach(m => m.remove());
}

window.changeToothStatus = function(num, status) {
    state.teethStatus[num] = status;
    const toothEl = document.getElementById(`tooth-container-${num}`);
    if(toothEl) {
        toothEl.setAttribute('data-status', status);
        showToast(`Pieza ${num} marcada como: ${status}`, "info");
    }
    closeAllToothMenus();
};

// Discount stock from checklist
window.handleInsumoCheck = function(name, checkbox) {
    const item = state.inventory.find(i => i.name === name);
    if (!item) return;

    if (checkbox.checked) {
        if(item.quantity > 0) {
            item.quantity -= 1;
            if(item.quantity <= item.minStock) {
                item.status = 'Crítico';
                showToast(`¡Alerta! ${item.name} ha caído a stock crítico (${item.quantity} unidades)`, "alert");
            } else {
                showToast(`Descontado 1 ${item.name} del inventario central.`, "success");
            }
        } else {
            showToast(`¡Error! No queda stock disponible de ${item.name}`, "danger");
            checkbox.checked = false;
        }
    } else {
        item.quantity += 1;
        if(item.quantity > item.minStock) item.status = 'Normal';
        showToast(`Reintegrado 1 ${item.name} al stock.`, "info");
    }

    // Refresh stocks labels in Doctor Panel
    const lblRes = document.getElementById('lbl-stock-resina');
    const lblAne = document.getElementById('lbl-stock-anestesia');
    if(lblRes) lblRes.textContent = state.inventory.find(i=>i.id===1).quantity;
    if(lblAne) lblAne.textContent = state.inventory.find(i=>i.id===5).quantity;
};

// Sending doctor alerts to recepción
document.getElementById('btn-close-doc-modal').onclick = function() {
    document.getElementById('modal-doctor-notif').classList.add('hidden');
};

document.getElementById('btn-send-doc-notif').onclick = function() {
    const type = document.getElementById('doctor-notif-type').value;
    const detail = document.getElementById('doctor-notif-detail').value;
    
    let messageText = "";
    if(type === 'insumo') messageText = `necesita insumo: ${detail}`;
    else if(type === 'pago') messageText = "paciente pasa a caja";
    else if(type === 'libre') messageText = "Box libre, llama siguiente paciente";
    else messageText = "solicita Asistente Urgente!";

    // Push into notifications state
    state.notifications.unshift({
        id: Date.now(),
        from: `Dr. Carlos Arana (Box 2)`,
        text: messageText,
        time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        confirmed: false
    });

    document.getElementById('modal-doctor-notif').classList.add('hidden');
    showToast("Notificación enviada a recepción", "success");
    
    // Add badge indicators
    const b = document.getElementById('internal-noti-badge');
    b.classList.remove('hidden');
    b.textContent = state.notifications.filter(n => !n.confirmed).length;
};

// Hide/Show details field depending on select option
document.getElementById('doctor-notif-type').onchange = function() {
    const group = document.getElementById('notif-detail-group');
    if(this.value === 'insumo') group.classList.remove('hidden');
    else group.classList.add('hidden');
};

// ----------------------------------------------------
// VIEW RENDERING: CONTADOR (DON LUCHO - COMISIONES)
// ----------------------------------------------------
function renderComisionesPanel(container) {
    // Math sums for comisiones
    const totalComission = state.comisiones.reduce((sum, c) => sum + c.commission, 0);
    const totalTreated = state.comisiones.reduce((sum, c) => sum + c.total, 0);
    const totalTreatments = state.comisiones.reduce((sum, c) => sum + c.treatments, 0);

    container.innerHTML = `
        <div class="animate-fade-in grid-2-1" style="grid-template-columns: 2fr 1fr; gap: 20px;">
            
            <!-- LEFT: COMMISSION LIST & PAY METHOD PIE -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-list-check"></i> Tabla de Comisiones por Especialista</h3>
                        
                        <!-- Period selector dropdowns -->
                        <div style="display:flex; gap:6px;">
                            <select class="btn-demo-switch" style="padding:2px 8px;">
                                <option>Octubre</option>
                                <option>Noviembre</option>
                                <option>Diciembre</option>
                            </select>
                            <select class="btn-demo-switch" style="padding:2px 8px;">
                                <option>2025</option>
                                <option>2026</option>
                            </select>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Doctor</th>
                                    <th>N° Tratamientos</th>
                                    <th>Tipo Frecuente</th>
                                    <th>Monto Total Tratado</th>
                                    <th>% Comisión</th>
                                    <th>Monto a Pagar</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.comisiones.map(c => `
                                    <tr>
                                        <td style="font-weight:600; color: var(--text-primary);">${c.name}</td>
                                        <td>${c.treatments}</td>
                                        <td>${c.type}</td>
                                        <td>S/. ${c.total.toLocaleString()}</td>
                                        <td>${c.percentage}%</td>
                                        <td style="font-weight:700; color:var(--success);">S/. ${c.commission.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                                <tr style="border-top:2px solid var(--border); font-weight:700;">
                                    <td style="color: var(--text-primary);">Totales</td>
                                    <td style="color: var(--text-primary);">${totalTreatments}</td>
                                    <td>-</td>
                                    <td style="color: var(--text-primary);">S/. ${totalTreated.toLocaleString()}</td>
                                    <td>-</td>
                                    <td style="color:var(--success); font-size:15px;">S/. ${totalComission.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PAYMENT SPLITS (Pie charts mockup) -->
                <div class="card">
                    <div class="card-title-header">
                        <h3><i class="fa-solid fa-chart-pie"></i> Desglose por Método de Pago (Consolidado)</h3>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:20px; align-items:center;">
                        
                        <!-- Pie chart representation using a CSS gradient ring -->
                        <div style="display:flex; justify-content:center;">
                            <div style="width: 110px; height: 110px; border-radius: 50%; background: conic-gradient(var(--secondary) 0% 65%, var(--alert) 65% 80%, var(--primary) 80% 100%); display:flex; justify-content:center; align-items:center;">
                                <div style="width:70px; height:70px; border-radius:50%; background:var(--bg-card); display:flex; justify-content:center; align-items:center; font-size:12px; font-weight:700; color: var(--text-primary);">
                                    S/. ${totalTreated.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span><span style="display:inline-block; width:12px; height:12px; background:var(--secondary); border-radius:3px; margin-right:6px; vertical-align:middle;"></span> POS Tarjeta (65%):</span>
                                <strong style="color: var(--text-primary);">S/. ${(totalTreated * 0.65).toLocaleString()}</strong>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span><span style="display:inline-block; width:12px; height:12px; background:var(--alert); border-radius:3px; margin-right:6px; vertical-align:middle;"></span> Yape / Plin (15%):</span>
                                <strong style="color: var(--text-primary);">S/. ${(totalTreated * 0.15).toLocaleString()}</strong>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span><span style="display:inline-block; width:12px; height:12px; background:var(--primary); border-radius:3px; margin-right:6px; vertical-align:middle;"></span> Efectivo (20%):</span>
                                <strong style="color: var(--text-primary);">S/. ${(totalTreated * 0.20).toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT: TIMELINE CALENDAR & EXPORTS -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                
                <!-- ATTENTION CALENDAR TIMELINE -->
                <div class="card">
                    <div class="card-title-header" style="margin-bottom:10px;">
                        <h3><i class="fa-solid fa-calendar-days"></i> Línea de Tiempo de Atenciones</h3>
                    </div>
                    <div style="font-size:10px; color:var(--text-secondary); margin-bottom:12px; display:flex; gap:8px;">
                        <span><span style="width:6px; height:6px; border-radius:50%; background:var(--success); display:inline-block;"></span> Bajo</span>
                        <span><span style="width:6px; height:6px; border-radius:50%; background:var(--warning); display:inline-block;"></span> Medio</span>
                        <span><span style="width:6px; height:6px; border-radius:50%; background:var(--danger); display:inline-block;"></span> Alto</span>
                    </div>

                    <!-- Compact calendar layout for Oct 2025 -->
                    <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:6px; font-size:10px; text-align:center;">
                        <div style="color:var(--text-muted); font-weight:700;">L</div>
                        <div style="color:var(--text-muted); font-weight:700;">M</div>
                        <div style="color:var(--text-muted); font-weight:700;">M</div>
                        <div style="color:var(--text-muted); font-weight:700;">J</div>
                        <div style="color:var(--text-muted); font-weight:700;">V</div>
                        <div style="color:var(--text-muted); font-weight:700;">S</div>
                        <div style="color:var(--text-muted); font-weight:700;">D</div>
                        
                        <!-- Empty grids for offset -->
                        <div></div><div></div><div></div>
                        
                        ${Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                            let dot = 'transparent';
                            if (day % 3 === 0) dot = 'var(--success)';
                            else if (day % 4 === 0) dot = 'var(--warning)';
                            else if (day % 5 === 0) dot = 'var(--danger)';
                            
                            return `
                                <div style="padding: 6px 2px; border:1px solid rgba(255,255,255,0.02); border-radius:4px; position:relative; background:rgba(255,255,255,0.01);">
                                    <span style="color:var(--text-secondary);">${day}</span>
                                    ${dot !== 'transparent' ? `<span style="width:4px; height:4px; border-radius:50%; background:${dot}; position:absolute; bottom:2px; left:50%; transform:translateX(-50%);"></span>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- EXPORTS SECTION -->
                <div class="card" style="display:flex; flex-direction:column; gap:10px;">
                    <h4 style="font-size:13px; color: var(--text-primary); margin-bottom:5px; text-transform:uppercase;">Acciones Contables</h4>
                    <button class="btn-secondary" onclick="exportData('Excel')"><i class="fa-solid fa-file-excel" style="color:var(--success);"></i> Exportar a Excel</button>
                    <button class="btn-secondary" onclick="exportData('PDF')"><i class="fa-solid fa-file-pdf" style="color:var(--danger);"></i> Exportar a PDF</button>
                    <button class="btn-secondary" onclick="exportData('Email')"><i class="fa-solid fa-envelope"></i> Enviar por Email a Contador</button>
                </div>

                <!-- LIQUIDATE CLOSE MONTH -->
                <button class="btn-primary" id="btn-open-close-month-modal" style="background:var(--alert); box-shadow:0 4px 15px rgba(249, 115, 22, 0.3); font-weight:700; height:50px;">
                    <i class="fa-solid fa-circle-check"></i> CERRAR MES Y GENERAR LIQUIDACIÓN
                </button>
            </div>

        </div>
    `;

    // Hook Close month modal
    document.getElementById('btn-open-close-month-modal').onclick = function() {
        document.getElementById('modal-close-month').classList.remove('hidden');
    };
}

// Real Export Action
window.exportData = function(type) {
    if (type === 'Excel') {
        // Generate a real CSV download with BOM to support accents/UTF-8 in Excel
        let csv = 'Doctor,Tratamientos,Tipo Frecuente,Monto Total,Porcentaje,Comision\n';
        state.comisiones.forEach(c => {
            csv += `"${c.name}",${c.treatments},"${c.type}",${c.total},${c.percentage}%,${c.commission}\n`;
        });
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `Comisiones_OdontoSan_Octubre_2025.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Informe de comisiones exportado a Excel (CSV) exitosamente.", "success");
    } else if (type === 'PDF') {
        // Calculate totals
        const totalTreatments = state.comisiones.reduce((sum, c) => sum + c.treatments, 0);
        const totalTreated = state.comisiones.reduce((sum, c) => sum + c.total, 0);
        const totalCom = state.comisiones.reduce((sum, c) => sum + c.commission, 0);

        // Create a temporary print div
        let printDiv = document.getElementById('print-report-container');
        if (!printDiv) {
            printDiv = document.createElement('div');
            printDiv.id = 'print-report-container';
            document.body.appendChild(printDiv);
        }

        // Inject beautiful print template with logo.jpg
        printDiv.innerHTML = `
            <div style="padding: 40px; font-family: 'Outfit', sans-serif; color: #1e293b; background: #ffffff; max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px;">
                <!-- Header with Logo and Title -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="logo.jpg" alt="OdontoSan Logo" style="height: 60px; object-fit: contain;">
                        <div>
                            <h1 style="font-size: 24px; color: #0d9488; margin: 0; font-weight: 800; font-family: 'Outfit', sans-serif;">CLÍNICA DENTAL ODONTOSAN</h1>
                            <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Jesús María, Lima | RUC: 20601234567</p>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="font-size: 16px; margin: 0; color: #0f172a; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Liquidación de Comisiones</h2>
                        <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0;">Periodo Contable: Octubre 2025</p>
                    </div>
                </div>

                <!-- Metadata Details -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 12px; background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <div>
                        <p style="margin: 4px 0;"><strong>Generado por:</strong> Don Lucho (Contabilidad)</p>
                        <p style="margin: 4px 0;"><strong>Fecha de Emisión:</strong> ${new Date().toLocaleString('es-PE')}</p>
                    </div>
                    <div>
                        <p style="margin: 4px 0;"><strong>Sede:</strong> Sede Principal - Jesús María</p>
                        <p style="margin: 4px 0;"><strong>Estado del Cierre:</strong> Auditado y Aprobado</p>
                    </div>
                </div>

                <!-- Table of Commissions -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; text-align: left;">
                    <thead>
                        <tr style="background: #0d9488; color: white;">
                            <th style="padding: 12px 10px; border: 1px solid #0d9488; font-weight: 600; text-transform: uppercase;">Nombre del Doctor</th>
                            <th style="padding: 12px 10px; border: 1px solid #0d9488; text-align: center; font-weight: 600; text-transform: uppercase;">N° Tratados</th>
                            <th style="padding: 12px 10px; border: 1px solid #0d9488; font-weight: 600; text-transform: uppercase;">Tipo Frecuente</th>
                            <th style="padding: 12px 10px; border: 1px solid #0d9488; text-align: right; font-weight: 600; text-transform: uppercase;">Monto Total</th>
                            <th style="padding: 12px 10px; border: 1px solid #0d9488; text-align: center; font-weight: 600; text-transform: uppercase;">% Com.</th>
                            <th style="padding: 12px 10px; border: 1px solid #0d9488; text-align: right; font-weight: 600; text-transform: uppercase;">Monto Comisión</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.comisiones.map(c => `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 12px 10px; font-weight: 600; color: #0f172a;">${c.name}</td>
                                <td style="padding: 12px 10px; text-align: center; color: #475569;">${c.treatments}</td>
                                <td style="padding: 12px 10px; color: #475569;">${c.type}</td>
                                <td style="padding: 12px 10px; text-align: right; color: #475569;">S/. ${c.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                                <td style="padding: 12px 10px; text-align: center; color: #475569;">${c.percentage}%</td>
                                <td style="padding: 12px 10px; text-align: right; font-weight: 700; color: #10b981;">S/. ${c.commission.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        `).join('')}
                        <tr style="background: #f8fafc; font-weight: 700;">
                            <td style="padding: 14px 10px; border-top: 2px solid #0d9488; color: #0f172a;">Totales</td>
                            <td style="padding: 14px 10px; border-top: 2px solid #0d9488; text-align: center; color: #0f172a;">${totalTreatments}</td>
                            <td style="padding: 14px 10px; border-top: 2px solid #0d9488;">-</td>
                            <td style="padding: 14px 10px; border-top: 2px solid #0d9488; text-align: right; color: #0f172a;">S/. ${totalTreated.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                            <td style="padding: 14px 10px; border-top: 2px solid #0d9488;">-</td>
                            <td style="padding: 14px 10px; border-top: 2px solid #0d9488; text-align: right; color: #10b981; font-size: 14px;">S/. ${totalCom.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Totals Summary Block -->
                <div style="display: flex; justify-content: flex-end; margin-bottom: 40px; font-size: 13px;">
                    <div style="width: 320px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                        <div style="background: #f8fafc; padding: 10px; font-weight: 700; border-bottom: 1px solid #e2e8f0; text-align: center; color: #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
                            Resumen Financiero Consolidado
                        </div>
                        <div style="padding: 12px; display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #475569;">Total de Atenciones del Mes:</span>
                                <strong style="color: #0f172a;">${totalTreatments}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #475569;">Monto Total Facturado:</span>
                                <strong style="color: #0f172a;">S/. ${totalTreated.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; border-top: 1px dashed #cbd5e1; padding-top: 8px; color: #10b981; font-size: 15px;">
                                <strong>Monto Total de Comisiones:</strong>
                                <strong>S/. ${totalCom.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Signatures -->
                <div style="display: flex; justify-content: space-between; margin-top: 60px; font-size: 11px; text-align: center;">
                    <div style="width: 220px; border-top: 1px solid #94a3b8; padding-top: 8px; color: #475569;">
                        Don Lucho (Luis Castro)<br><strong>Contador General</strong>
                    </div>
                    <div style="width: 220px; border-top: 1px solid #94a3b8; padding-top: 8px; color: #475569;">
                        Dr. Carlos Mendoza<br><strong>Director Médico - Ejecutivo</strong>
                    </div>
                </div>

                <!-- Footer Copyright -->
                <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    Clínica Dental OdontoSan S.A.C | Av. Horacio Urteaga, Jesús María, Lima | Tel: 461-2030
                </div>
            </div>
        `;

        // Trigger native print dialog
        window.print();

        // Clear contents afterward
        setTimeout(() => {
            printDiv.innerHTML = '';
        }, 1000);

        showToast("Se ha abierto el diálogo de impresión. Seleccione 'Guardar como PDF' para guardar el reporte con el logo.", "success");
    } else if (type === 'Email') {
        openEmailModal();
    }
};

function openEmailModal() {
    const totalCom = state.comisiones.reduce((sum, c) => sum + c.commission, 0);
    const totalTreatments = state.comisiones.reduce((sum, c) => sum + c.treatments, 0);
    
    const body = document.getElementById('email-body');
    if (body) {
        body.value = `Estimado Don Lucho,\n\nAdjunto la liquidación mensual de comisiones consolidada correspondiente a Octubre 2025 para su revisión y arqueo contable.\n\nTotal Comisiones: S/. ${totalCom.toLocaleString()}\nTotal Tratamientos: ${totalTreatments}\n\nSaludos cordiales,\nAdministración OdontoSan`;
    }
    
    document.getElementById('modal-email-composer').classList.remove('hidden');
    document.getElementById('email-sending-progress').classList.add('hidden');
    const sendBtn = document.getElementById('btn-send-email-submit');
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = "Enviar Correo";
    }
}

// Close month modal actions
document.getElementById('btn-close-month-modal-cancel').onclick = function() {
    document.getElementById('modal-close-month').classList.add('hidden');
};

document.getElementById('btn-close-month-modal-confirm').onclick = function() {
    document.getElementById('modal-close-month').classList.add('hidden');
    showToast("Cierre Contable finalizado exitosamente. Planilla enviada al correo de Don Lucho.", "success");
};

// ----------------------------------------------------
// VIEW RENDERING: FIORELLA (INVENTARIO)
// ----------------------------------------------------
function renderInventoryPanel(container) {
    container.innerHTML = `
        <div class="animate-fade-in card">
            <div class="card-title-header">
                <h3><i class="fa-solid fa-boxes-stacked"></i> Módulo de Inventario de Insumos</h3>
                <span style="font-size:11px; color:var(--text-muted);">Ubicación Almacén: Sótano Principal</span>
            </div>
            
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Insumo</th>
                            <th>Stock Disponible</th>
                            <th>Medida</th>
                            <th>Proveedor</th>
                            <th>Stock Mínimo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.inventory.map(item => `
                            <tr class="${item.status === 'Crítico' ? 'highlight' : ''}">
                                <td style="font-weight:600; color: var(--text-primary);">${item.name}</td>
                                <td style="font-weight:700; font-size:15px; color:${item.status === 'Crítico' ? 'var(--danger)' : 'var(--text-primary)'};">${item.quantity}</td>
                                <td>${item.unit}</td>
                                <td>${item.provider}</td>
                                <td>${item.minStock}</td>
                                <td><span class="badge ${item.status === 'Crítico' ? 'badge-critical' : 'badge-inbox'}">${item.status}</span></td>
                                <td>
                                    <button class="btn-demo-switch" style="padding: 4px 10px;" onclick="replenishItem(${item.id})">
                                        <i class="fa-solid fa-truck-ramp-box"></i> Comprar
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// VIEW RENDERING: COCA Y FACTURACIÓN (LISTA DE COBROS)
// ----------------------------------------------------
function renderCashRegisterPanel(container) {
    // Show patients list that are ready to checkout
    const unpaidPatients = state.patients.filter(p => p.status === 'Pendiente Pago');
    
    container.innerHTML = `
        <div class="animate-fade-in card">
            <div class="card-title-header">
                <h3><i class="fa-solid fa-file-invoice-dollar"></i> Cola de Facturación y Cobros Pendientes</h3>
            </div>
            
            ${unpaidPatients.length === 0 ? `
                <div style="text-align:center; padding: 40px; color: var(--text-muted);">
                    <i class="fa-solid fa-circle-check" style="font-size:36px; color:var(--success); margin-bottom: 10px;"></i>
                    <p>No hay pacientes pendientes de pago en la caja.</p>
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Tratamiento</th>
                                <th>Doctor Responsable</th>
                                <th>Monto Total</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${unpaidPatients.map(p => `
                                <tr>
                                    <td style="font-weight:600; color: var(--text-primary);">${p.name}</td>
                                    <td>${p.treatment}</td>
                                    <td>${p.doctor}</td>
                                    <td style="font-weight:700; color:var(--alert);">S/. ${p.cost.toFixed(2)}</td>
                                    <td>
                                        <button class="btn-primary" style="width:auto; padding:6px 12px; background:var(--success);" onclick="openCheckoutModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                                            <i class="fa-solid fa-cash-register"></i> Cobrar
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
}

// ----------------------------------------------------
// PORTAL PACIENTE: BOOKING FORM WIZARD (SRA. PATY)
// ----------------------------------------------------
function resetBookingWizard() {
    state.booking = {
        specialty: null,
        doctor: null,
        date: null,
        time: null,
        name: 'Sra. Paty',
        phone: '994321876',
        email: 'paty.cruz@gmail.com',
        smsConsent: true
    };
    
    // Reset wizard slides
    document.getElementById('booking-step-1').classList.remove('hidden');
    document.getElementById('booking-step-2').classList.add('hidden');
    document.getElementById('booking-step-3').classList.add('hidden');
    document.getElementById('booking-success').classList.add('hidden');
    
    // Steppers pills reset
    setStepActive(1);

    // Show whatsapp FAB on reset
    document.getElementById('whatsapp-widget').classList.remove('hidden');
}

function setStepActive(stepNum) {
    const pills = [
        document.getElementById('step-1-indicator'),
        document.getElementById('step-2-indicator'),
        document.getElementById('step-3-indicator')
    ];
    
    const dividers = [
        document.getElementById('step-1-2-divider'),
        document.getElementById('step-2-3-divider')
    ];

    pills.forEach((pill, idx) => {
        if(idx + 1 < stepNum) {
            pill.className = "step-pill completed";
        } else if (idx + 1 === stepNum) {
            pill.className = "step-pill active";
        } else {
            pill.className = "step-pill";
        }
    });

    dividers.forEach((div, idx) => {
        if(idx + 1 < stepNum) div.style.background = 'var(--success)';
        else div.style.background = 'var(--border)';
    });
}

// Step 1 Click Handler: specialty cards
document.querySelectorAll('.specialty-card').forEach(card => {
    card.onclick = function() {
        const specialty = this.getAttribute('data-specialty');
        state.booking.specialty = specialty;
        
        // Go to Step 2
        document.getElementById('booking-step-1').classList.add('hidden');
        document.getElementById('booking-step-2').classList.remove('hidden');
        setStepActive(2);

        // Load step 2 data
        loadStep2Doctors(specialty);
    };
});

function loadStep2Doctors(specialty) {
    const listContainer = document.getElementById('booking-doctors-list');
    listContainer.innerHTML = '';
    
    const docs = doctorsDb[specialty] || [];
    docs.forEach((doc, idx) => {
        const card = document.createElement('div');
        card.className = `doctor-select-card ${idx === 0 ? 'active' : ''}`;
        card.setAttribute('data-doc-name', doc.name);
        card.setAttribute('data-doc-avatar', doc.avatar);
        card.innerHTML = `
            <div class="doctor-avatar-circle">
                <img src="${doc.avatar}" alt="${doc.name}">
            </div>
            <div class="doctor-select-info">
                <h4>${doc.name}</h4>
                <p>Especialista en ${specialty}</p>
            </div>
        `;
        card.onclick = () => {
            document.querySelectorAll('.doctor-select-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.booking.doctor = doc.name;
        };
        listContainer.appendChild(card);
    });

    state.booking.doctor = docs[0] ? docs[0].name : '';

    // Render Calendar
    const calendarContainer = document.getElementById('booking-calendar-grid');
    calendarContainer.innerHTML = '';
    
    // Day Names header
    const daysHeader = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
    daysHeader.forEach(d => {
        const h = document.createElement('div');
        h.className = 'calendar-day-header';
        h.textContent = d;
        calendarContainer.appendChild(h);
    });

    // Generate days (E.g. Monday 22 June to Friday 26 June)
    const days = [
        { num: 22, name: 'Lunes' },
        { num: 23, name: 'Martes' },
        { num: 24, name: 'Miércoles' },
        { num: 25, name: 'Jueves' },
        { num: 26, name: 'Viernes' }
    ];

    days.forEach((day, idx) => {
        const btn = document.createElement('div');
        btn.className = `calendar-day-btn ${idx === 1 ? 'active' : ''}`; // Tuesday June 23 selected default
        btn.innerHTML = `
            <span class="day-num">${day.num}</span>
            <span class="day-name">${day.name.substring(0,3)}</span>
        `;
        btn.onclick = () => {
            document.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.booking.date = `Martes 23 Jun`; // Simple mock
        };
        calendarContainer.appendChild(btn);
    });

    state.booking.date = 'Martes 23 Jun';

    // Time Slots grid
    const slotsGrid = document.getElementById('booking-slots-grid');
    slotsGrid.innerHTML = '';
    
    const slots = [
        { time: '9:00 AM', available: false },
        { time: '9:30 AM', available: false },
        { time: '10:00 AM', available: true }, // Highlighted matching wireframe
        { time: '10:30 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '11:30 AM', available: false },
        { time: '4:00 PM', available: true },
        { time: '4:30 PM', available: true }
    ];

    slots.forEach(slot => {
        const btn = document.createElement('button');
        btn.className = 'time-slot-btn';
        btn.textContent = slot.time;
        if(!slot.available) btn.disabled = true;
        
        btn.onclick = () => {
            document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.booking.time = slot.time;
            
            // Go to Step 3
            goToStep3();
        };
        slotsGrid.appendChild(btn);
    });
}

function goToStep3() {
    // Hide WhatsApp widget during step 3 to prevent overlap bug (z-index bug fix)
    document.getElementById('whatsapp-widget').classList.add('hidden');

    document.getElementById('booking-step-2').classList.add('hidden');
    document.getElementById('booking-step-3').classList.remove('hidden');
    setStepActive(3);

    // Load step 3 labels
    document.getElementById('summary-specialty').textContent = state.booking.specialty;
    document.getElementById('summary-doc-name').textContent = state.booking.doctor;
    document.getElementById('summary-time').textContent = `${state.booking.date} - ${state.booking.time}`;
    
    // Doctor Avatar match
    const docData = doctorsDb[state.booking.specialty].find(d => d.name === state.booking.doctor);
    if(docData) document.getElementById('summary-doc-img').src = docData.avatar;
}

// Confirming Bookings
document.getElementById('btn-patient-confirm-booking').onclick = function() {
    const nameInput = document.getElementById('patient-form-name').value;
    const phoneInput = document.getElementById('patient-form-phone').value;
    const emailInput = document.getElementById('patient-form-email').value;
    
    if(!nameInput || !phoneInput || !emailInput) {
        showToast("Por favor complete todos los datos personales", "danger");
        return;
    }

    state.booking.name = nameInput;
    state.booking.phone = phoneInput;
    state.booking.email = emailInput;
    state.booking.smsConsent = document.getElementById('patient-form-sms').checked;

    // Simulate Cloud DB Push
    const submitBtn = document.getElementById('btn-patient-confirm-booking');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Procesando Reserva...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    
    setTimeout(() => {
        // Successful booking
        document.getElementById('booking-step-3').classList.add('hidden');
        document.getElementById('booking-success').classList.remove('hidden');

        // Set Labels in Success Card
        document.getElementById('success-pat-name').textContent = state.booking.name;
        document.getElementById('success-pat-doc').textContent = state.booking.doctor;
        document.getElementById('success-pat-time').textContent = `${state.booking.date} - ${state.booking.time}`;

        // WebSocket/Server Sync: Insert patient into the main waitlist in real-time
        const newPatient = {
            id: Date.now(),
            name: state.booking.name,
            arrival: state.booking.time,
            doctor: state.booking.doctor,
            status: 'Esperando',
            treatment: state.booking.specialty,
            cost: state.booking.specialty === 'Curación Estética' ? 280 : 150
        };
        state.patients.push(newPatient);

        // Send a simulated booking alert to Milagros reception panel
        state.notifications.unshift({
            id: Date.now() + 1,
            from: 'Portal Web Pacientes',
            text: `Nueva cita online: ${newPatient.name} reservó con ${newPatient.doctor} (${newPatient.arrival})`,
            time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            confirmed: false
        });

        // Trigger Beep
        playBeep('success');
        showToast("Cita registrada y confirmada vía SMS", "success");

        // Set alert badge on Receptionist panel
        const badge = document.getElementById('citas-pending-badge');
        badge.classList.remove('hidden');
        badge.textContent = parseInt(badge.textContent || 0) + 1;

    }, 1200);
};

document.getElementById('btn-patient-booking-restart').onclick = function() {
    resetBookingWizard();
};

// ----------------------------------------------------
// APPLICATION STARTUP
// ----------------------------------------------------
window.onload = initApp;
