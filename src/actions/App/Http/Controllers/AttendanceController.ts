import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceController::publicTerminal
 * @see app/Http/Controllers/AttendanceController.php:521
 * @route '/absensi/terminal'
 */
export const publicTerminal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicTerminal.url(options),
    method: 'get',
})

publicTerminal.definition = {
    methods: ["get","head"],
    url: '/absensi/terminal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::publicTerminal
 * @see app/Http/Controllers/AttendanceController.php:521
 * @route '/absensi/terminal'
 */
publicTerminal.url = (options?: RouteQueryOptions) => {
    return publicTerminal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::publicTerminal
 * @see app/Http/Controllers/AttendanceController.php:521
 * @route '/absensi/terminal'
 */
publicTerminal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicTerminal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::publicTerminal
 * @see app/Http/Controllers/AttendanceController.php:521
 * @route '/absensi/terminal'
 */
publicTerminal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicTerminal.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::publicTerminal
 * @see app/Http/Controllers/AttendanceController.php:521
 * @route '/absensi/terminal'
 */
    const publicTerminalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: publicTerminal.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::publicTerminal
 * @see app/Http/Controllers/AttendanceController.php:521
 * @route '/absensi/terminal'
 */
        publicTerminalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicTerminal.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::publicTerminal
 * @see app/Http/Controllers/AttendanceController.php:521
 * @route '/absensi/terminal'
 */
        publicTerminalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicTerminal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    publicTerminal.form = publicTerminalForm
/**
* @see \App\Http\Controllers\AttendanceController::activateTerminal
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
export const activateTerminal = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateTerminal.url(options),
    method: 'post',
})

activateTerminal.definition = {
    methods: ["post"],
    url: '/api/absensi/terminal/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::activateTerminal
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
activateTerminal.url = (options?: RouteQueryOptions) => {
    return activateTerminal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::activateTerminal
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
activateTerminal.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateTerminal.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::activateTerminal
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
    const activateTerminalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activateTerminal.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::activateTerminal
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
        activateTerminalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activateTerminal.url(options),
            method: 'post',
        })
    
    activateTerminal.form = activateTerminalForm
/**
* @see \App\Http\Controllers\AttendanceController::getTerminalQrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
export const getTerminalQrToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTerminalQrToken.url(options),
    method: 'get',
})

getTerminalQrToken.definition = {
    methods: ["get","head"],
    url: '/api/absensi/terminal/qr-token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::getTerminalQrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
getTerminalQrToken.url = (options?: RouteQueryOptions) => {
    return getTerminalQrToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::getTerminalQrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
getTerminalQrToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTerminalQrToken.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::getTerminalQrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
getTerminalQrToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTerminalQrToken.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::getTerminalQrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
    const getTerminalQrTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getTerminalQrToken.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::getTerminalQrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
        getTerminalQrTokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTerminalQrToken.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::getTerminalQrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
        getTerminalQrTokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getTerminalQrToken.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getTerminalQrToken.form = getTerminalQrTokenForm
/**
* @see \App\Http\Controllers\AttendanceController::approveMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
export const approveMethodRequest = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveMethodRequest.url(args, options),
    method: 'post',
})

approveMethodRequest.definition = {
    methods: ["post"],
    url: '/absensi/method-requests/{methodRequest}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::approveMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
approveMethodRequest.url = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { methodRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { methodRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    methodRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        methodRequest: typeof args.methodRequest === 'object'
                ? args.methodRequest.id
                : args.methodRequest,
                }

    return approveMethodRequest.definition.url
            .replace('{methodRequest}', parsedArgs.methodRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::approveMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
approveMethodRequest.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveMethodRequest.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::approveMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
    const approveMethodRequestForm = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveMethodRequest.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::approveMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
        approveMethodRequestForm.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveMethodRequest.url(args, options),
            method: 'post',
        })
    
    approveMethodRequest.form = approveMethodRequestForm
/**
* @see \App\Http\Controllers\AttendanceController::rejectMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
export const rejectMethodRequest = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectMethodRequest.url(args, options),
    method: 'post',
})

rejectMethodRequest.definition = {
    methods: ["post"],
    url: '/absensi/method-requests/{methodRequest}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::rejectMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
rejectMethodRequest.url = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { methodRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { methodRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    methodRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        methodRequest: typeof args.methodRequest === 'object'
                ? args.methodRequest.id
                : args.methodRequest,
                }

    return rejectMethodRequest.definition.url
            .replace('{methodRequest}', parsedArgs.methodRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::rejectMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
rejectMethodRequest.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectMethodRequest.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::rejectMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
    const rejectMethodRequestForm = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rejectMethodRequest.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::rejectMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
        rejectMethodRequestForm.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rejectMethodRequest.url(args, options),
            method: 'post',
        })
    
    rejectMethodRequest.form = rejectMethodRequestForm
/**
* @see \App\Http\Controllers\AttendanceController::getShopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
export const getShopQrToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getShopQrToken.url(options),
    method: 'get',
})

getShopQrToken.definition = {
    methods: ["get","head"],
    url: '/api/absensi/shop-qr-token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::getShopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
getShopQrToken.url = (options?: RouteQueryOptions) => {
    return getShopQrToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::getShopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
getShopQrToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getShopQrToken.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::getShopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
getShopQrToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getShopQrToken.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::getShopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
    const getShopQrTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getShopQrToken.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::getShopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
        getShopQrTokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getShopQrToken.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::getShopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
        getShopQrTokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getShopQrToken.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getShopQrToken.form = getShopQrTokenForm
/**
* @see \App\Http\Controllers\AttendanceController::todayLog
 * @see app/Http/Controllers/AttendanceController.php:413
 * @route '/api/absensi/today-log'
 */
export const todayLog = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: todayLog.url(options),
    method: 'get',
})

todayLog.definition = {
    methods: ["get","head"],
    url: '/api/absensi/today-log',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::todayLog
 * @see app/Http/Controllers/AttendanceController.php:413
 * @route '/api/absensi/today-log'
 */
todayLog.url = (options?: RouteQueryOptions) => {
    return todayLog.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::todayLog
 * @see app/Http/Controllers/AttendanceController.php:413
 * @route '/api/absensi/today-log'
 */
todayLog.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: todayLog.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::todayLog
 * @see app/Http/Controllers/AttendanceController.php:413
 * @route '/api/absensi/today-log'
 */
todayLog.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: todayLog.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::todayLog
 * @see app/Http/Controllers/AttendanceController.php:413
 * @route '/api/absensi/today-log'
 */
    const todayLogForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: todayLog.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::todayLog
 * @see app/Http/Controllers/AttendanceController.php:413
 * @route '/api/absensi/today-log'
 */
        todayLogForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: todayLog.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::todayLog
 * @see app/Http/Controllers/AttendanceController.php:413
 * @route '/api/absensi/today-log'
 */
        todayLogForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: todayLog.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    todayLog.form = todayLogForm
/**
* @see \App\Http\Controllers\AttendanceController::storeMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:440
 * @route '/absensi/method-request'
 */
export const storeMethodRequest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMethodRequest.url(options),
    method: 'post',
})

storeMethodRequest.definition = {
    methods: ["post"],
    url: '/absensi/method-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::storeMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:440
 * @route '/absensi/method-request'
 */
storeMethodRequest.url = (options?: RouteQueryOptions) => {
    return storeMethodRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::storeMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:440
 * @route '/absensi/method-request'
 */
storeMethodRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMethodRequest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::storeMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:440
 * @route '/absensi/method-request'
 */
    const storeMethodRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMethodRequest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::storeMethodRequest
 * @see app/Http/Controllers/AttendanceController.php:440
 * @route '/absensi/method-request'
 */
        storeMethodRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMethodRequest.url(options),
            method: 'post',
        })
    
    storeMethodRequest.form = storeMethodRequestForm
/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:23
 * @route '/absensi'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/absensi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:23
 * @route '/absensi'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:23
 * @route '/absensi'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:23
 * @route '/absensi'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:23
 * @route '/absensi'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:23
 * @route '/absensi'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:23
 * @route '/absensi'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\AttendanceController::clockIn
 * @see app/Http/Controllers/AttendanceController.php:142
 * @route '/absensi/clock-in'
 */
export const clockIn = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clockIn.url(options),
    method: 'post',
})

clockIn.definition = {
    methods: ["post"],
    url: '/absensi/clock-in',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::clockIn
 * @see app/Http/Controllers/AttendanceController.php:142
 * @route '/absensi/clock-in'
 */
clockIn.url = (options?: RouteQueryOptions) => {
    return clockIn.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::clockIn
 * @see app/Http/Controllers/AttendanceController.php:142
 * @route '/absensi/clock-in'
 */
clockIn.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clockIn.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::clockIn
 * @see app/Http/Controllers/AttendanceController.php:142
 * @route '/absensi/clock-in'
 */
    const clockInForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clockIn.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::clockIn
 * @see app/Http/Controllers/AttendanceController.php:142
 * @route '/absensi/clock-in'
 */
        clockInForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clockIn.url(options),
            method: 'post',
        })
    
    clockIn.form = clockInForm
/**
* @see \App\Http\Controllers\AttendanceController::clockOut
 * @see app/Http/Controllers/AttendanceController.php:193
 * @route '/absensi/clock-out'
 */
export const clockOut = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clockOut.url(options),
    method: 'post',
})

clockOut.definition = {
    methods: ["post"],
    url: '/absensi/clock-out',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::clockOut
 * @see app/Http/Controllers/AttendanceController.php:193
 * @route '/absensi/clock-out'
 */
clockOut.url = (options?: RouteQueryOptions) => {
    return clockOut.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::clockOut
 * @see app/Http/Controllers/AttendanceController.php:193
 * @route '/absensi/clock-out'
 */
clockOut.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clockOut.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::clockOut
 * @see app/Http/Controllers/AttendanceController.php:193
 * @route '/absensi/clock-out'
 */
    const clockOutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clockOut.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::clockOut
 * @see app/Http/Controllers/AttendanceController.php:193
 * @route '/absensi/clock-out'
 */
        clockOutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clockOut.url(options),
            method: 'post',
        })
    
    clockOut.form = clockOutForm
/**
* @see \App\Http\Controllers\AttendanceController::processShopQrScan
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
export const processShopQrScan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processShopQrScan.url(options),
    method: 'post',
})

processShopQrScan.definition = {
    methods: ["post"],
    url: '/api/absensi/scan-shop-qr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::processShopQrScan
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
processShopQrScan.url = (options?: RouteQueryOptions) => {
    return processShopQrScan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::processShopQrScan
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
processShopQrScan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processShopQrScan.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::processShopQrScan
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
    const processShopQrScanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: processShopQrScan.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::processShopQrScan
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
        processShopQrScanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: processShopQrScan.url(options),
            method: 'post',
        })
    
    processShopQrScan.form = processShopQrScanForm
const AttendanceController = { publicTerminal, activateTerminal, getTerminalQrToken, approveMethodRequest, rejectMethodRequest, getShopQrToken, todayLog, storeMethodRequest, index, clockIn, clockOut, processShopQrScan }

export default AttendanceController