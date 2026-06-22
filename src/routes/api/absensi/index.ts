import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import terminal from './terminal'
/**
* @see \App\Http\Controllers\AttendanceController::shopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
export const shopQrToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shopQrToken.url(options),
    method: 'get',
})

shopQrToken.definition = {
    methods: ["get","head"],
    url: '/api/absensi/shop-qr-token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::shopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
shopQrToken.url = (options?: RouteQueryOptions) => {
    return shopQrToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::shopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
shopQrToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shopQrToken.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::shopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
shopQrToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: shopQrToken.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::shopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
    const shopQrTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: shopQrToken.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::shopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
        shopQrTokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shopQrToken.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::shopQrToken
 * @see app/Http/Controllers/AttendanceController.php:233
 * @route '/api/absensi/shop-qr-token'
 */
        shopQrTokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: shopQrToken.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    shopQrToken.form = shopQrTokenForm
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
* @see \App\Http\Controllers\AttendanceController::scanShopQr
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
export const scanShopQr = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scanShopQr.url(options),
    method: 'post',
})

scanShopQr.definition = {
    methods: ["post"],
    url: '/api/absensi/scan-shop-qr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::scanShopQr
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
scanShopQr.url = (options?: RouteQueryOptions) => {
    return scanShopQr.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::scanShopQr
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
scanShopQr.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scanShopQr.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::scanShopQr
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
    const scanShopQrForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: scanShopQr.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::scanShopQr
 * @see app/Http/Controllers/AttendanceController.php:259
 * @route '/api/absensi/scan-shop-qr'
 */
        scanShopQrForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: scanShopQr.url(options),
            method: 'post',
        })
    
    scanShopQr.form = scanShopQrForm
const absensi = {
    terminal: Object.assign(terminal, terminal),
shopQrToken: Object.assign(shopQrToken, shopQrToken),
todayLog: Object.assign(todayLog, todayLog),
scanShopQr: Object.assign(scanShopQr, scanShopQr),
}

export default absensi