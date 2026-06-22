import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import methodRequests from './method-requests'
import methodRequest from './method-request'
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
const absensi = {
    publicTerminal: Object.assign(publicTerminal, publicTerminal),
methodRequests: Object.assign(methodRequests, methodRequests),
methodRequest: Object.assign(methodRequest, methodRequest),
index: Object.assign(index, index),
clockIn: Object.assign(clockIn, clockIn),
clockOut: Object.assign(clockOut, clockOut),
}

export default absensi