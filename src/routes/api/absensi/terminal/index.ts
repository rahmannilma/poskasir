import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceController::activate
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
export const activate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/api/absensi/terminal/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::activate
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
activate.url = (options?: RouteQueryOptions) => {
    return activate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::activate
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
activate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::activate
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
    const activateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::activate
 * @see app/Http/Controllers/AttendanceController.php:532
 * @route '/api/absensi/terminal/activate'
 */
        activateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activate.url(options),
            method: 'post',
        })
    
    activate.form = activateForm
/**
* @see \App\Http\Controllers\AttendanceController::qrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
export const qrToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrToken.url(options),
    method: 'get',
})

qrToken.definition = {
    methods: ["get","head"],
    url: '/api/absensi/terminal/qr-token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::qrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
qrToken.url = (options?: RouteQueryOptions) => {
    return qrToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::qrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
qrToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrToken.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::qrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
qrToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qrToken.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::qrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
    const qrTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: qrToken.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::qrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
        qrTokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qrToken.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::qrToken
 * @see app/Http/Controllers/AttendanceController.php:568
 * @route '/api/absensi/terminal/qr-token'
 */
        qrTokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qrToken.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    qrToken.form = qrTokenForm
const terminal = {
    activate: Object.assign(activate, activate),
qrToken: Object.assign(qrToken, qrToken),
}

export default terminal