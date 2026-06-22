import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceController::approve
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
export const approve = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/absensi/method-requests/{methodRequest}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::approve
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
approve.url = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{methodRequest}', parsedArgs.methodRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::approve
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
approve.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::approve
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
    const approveForm = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::approve
 * @see app/Http/Controllers/AttendanceController.php:476
 * @route '/absensi/method-requests/{methodRequest}/approve'
 */
        approveForm.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\AttendanceController::reject
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
export const reject = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/absensi/method-requests/{methodRequest}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::reject
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
reject.url = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{methodRequest}', parsedArgs.methodRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::reject
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
reject.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::reject
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
    const rejectForm = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::reject
 * @see app/Http/Controllers/AttendanceController.php:503
 * @route '/absensi/method-requests/{methodRequest}/reject'
 */
        rejectForm.post = (args: { methodRequest: number | { id: number } } | [methodRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const methodRequests = {
    approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
}

export default methodRequests