export const translations = {
    en: {
        // App
        driver: "Driver",

        // Login
        racing_subtitle: "Hyper-Speed Racing",
        identify_yourself: "Identify Yourself",
        racer_placeholder: "Enter your racer tag...",
        init_engine: "INITIALIZE ENGINE",
        system_ready: "2026",

        // Lobby
        race_control: "Race Control",
        welcome_back: "Welcome back",
        create_new_race: "Create New Race",
        host_lobby: "Host your own lobby and customize the rules.",
        initialize: "Initialize",
        wins: "Wins",
        division: "Division",
        track_selection: "Track Selection",
        laps: "Laps",
        max_players: "Max Players",
        cancel: "Cancel",
        launch_lobby: "Launch Lobby",
        live_feeds: "Live Feeds",
        network_online: "Network Online",
        no_active_signals: "No Active Signals",
        track_quiet: "The track is quiet. Be the one to start the engine.",
        join: "JOIN",
        waiting: "WAITING",
        playing: "PLAYING",
        racers: "Racers",

        // GameRoom
        establishing_link: "ESTABLISHING LINK...",
        leaderboard: "Leaderboard",
        drivers: "Drivers",
        finished: "FINISHED",
        did_not_finish: "Did not finish",
        lap: "Lap",
        waiting_for_drivers: "WAITING FOR DRIVERS",
        warm_up: "to warm up tires",
        get_ready: "GET READY",
        current_lap: "Current Lap",
        item_slot: "Item Slot",
        empty: "EMPTY",
        press_space: "PRESS [SPACE]",
        abort_race: "Abort Race",
        race_finished: "RACE FINISHED",
        performance_report: "Performance Report",
        time: "Time",
        return_to_base: "RETURN TO BASE",

        // Grid
        loading_circuit: "LOADING CIRCUIT DATA..."
    },
    es: {
        // App
        driver: "Piloto",

        // Login
        racing_subtitle: "Carreras de Alta Velocidad",
        identify_yourself: "Identifícate",
        racer_placeholder: "Introduce tu nombre de corredor...",
        init_engine: "INICIAR MOTOR",
        system_ready: "2026",

        // Lobby
        race_control: "Control de Carrera",
        welcome_back: "Bienvenido de nuevo",
        create_new_race: "Crear Nueva Carrera",
        host_lobby: "Crea tu propia sala y personaliza las reglas.",
        initialize: "Inicializar",
        wins: "Victorias",
        division: "División",
        track_selection: "Selección de Pista",
        laps: "Vueltas",
        max_players: "Máx. Jugadores",
        cancel: "Cancelar",
        launch_lobby: "Lanzar Sala",
        live_feeds: "Transmisiones en Vivo",
        network_online: "Red En Línea",
        no_active_signals: "Sin Señales Activas",
        track_quiet: "La pista está en silencio. Sé tú quien arranque el motor.",
        join: "UNIRSE",
        waiting: "ESPERANDO",
        playing: "JUGANDO",
        racers: "Corredores",

        // GameRoom
        establishing_link: "ESTABLECIENDO VÍNCULO...",
        leaderboard: "Clasificación",
        drivers: "Pilotos",
        finished: "FINALIZADO",
        did_not_finish: "No finalizó",
        lap: "Vuelta",
        waiting_for_drivers: "ESPERANDO CORREDORES",
        warm_up: "para calentar neumáticos",
        get_ready: "PREPÁRATE",
        current_lap: "Vuelta Actual",
        item_slot: "Ranura de Objeto",
        empty: "VACÍO",
        press_space: "PRESIONA [ESPACIO]",
        abort_race: "Abortar Carrera",
        race_finished: "CARRERA FINALIZADA",
        performance_report: "Informe de Rendimiento",
        time: "Tiempo",
        return_to_base: "VOLVER A LA BASE",

        // Grid
        loading_circuit: "CARGANDO DATOS DEL CIRCUITO..."
    }
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;
