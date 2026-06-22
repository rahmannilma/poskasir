import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SuperAdminController::index
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/owners',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdminController::index
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdminController::index
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdminController::index
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdminController::index
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdminController::index
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdminController::index
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
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
* @see \App\Http\Controllers\SuperAdminController::toggleStatus
 * @see app/Http/Controllers/SuperAdminController.php:50
 * @route '/owners/{owner}/toggle-status'
 */
export const toggleStatus = (args: { owner: number | { id: number } } | [owner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/owners/{owner}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuperAdminController::toggleStatus
 * @see app/Http/Controllers/SuperAdminController.php:50
 * @route '/owners/{owner}/toggle-status'
 */
toggleStatus.url = (args: { owner: number | { id: number } } | [owner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { owner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { owner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    owner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        owner: typeof args.owner === 'object'
                ? args.owner.id
                : args.owner,
                }

    return toggleStatus.definition.url
            .replace('{owner}', parsedArgs.owner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdminController::toggleStatus
 * @see app/Http/Controllers/SuperAdminController.php:50
 * @route '/owners/{owner}/toggle-status'
 */
toggleStatus.post = (args: { owner: number | { id: number } } | [owner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuperAdminController::toggleStatus
 * @see app/Http/Controllers/SuperAdminController.php:50
 * @route '/owners/{owner}/toggle-status'
 */
    const toggleStatusForm = (args: { owner: number | { id: number } } | [owner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuperAdminController::toggleStatus
 * @see app/Http/Controllers/SuperAdminController.php:50
 * @route '/owners/{owner}/toggle-status'
 */
        toggleStatusForm.post = (args: { owner: number | { id: number } } | [owner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, options),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\SuperAdminController::attendanceRequests
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
export const attendanceRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendanceRequests.url(options),
    method: 'get',
})

attendanceRequests.definition = {
    methods: ["get","head"],
    url: '/superadmin/absensi-approval',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdminController::attendanceRequests
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
attendanceRequests.url = (options?: RouteQueryOptions) => {
    return attendanceRequests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdminController::attendanceRequests
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
attendanceRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: attendanceRequests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdminController::attendanceRequests
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
attendanceRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: attendanceRequests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdminController::attendanceRequests
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
    const attendanceRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: attendanceRequests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdminController::attendanceRequests
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
        attendanceRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendanceRequests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdminController::attendanceRequests
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
        attendanceRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: attendanceRequests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    attendanceRequests.form = attendanceRequestsForm
const SuperAdminController = { index, toggleStatus, attendanceRequests }

export default SuperAdminController