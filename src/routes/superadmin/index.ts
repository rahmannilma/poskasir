import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import ownersB36aa0 from './owners'
/**
* @see \App\Http\Controllers\SuperAdminController::owners
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
export const owners = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: owners.url(options),
    method: 'get',
})

owners.definition = {
    methods: ["get","head"],
    url: '/owners',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdminController::owners
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
owners.url = (options?: RouteQueryOptions) => {
    return owners.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdminController::owners
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
owners.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: owners.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdminController::owners
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
owners.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: owners.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdminController::owners
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
    const ownersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: owners.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdminController::owners
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
        ownersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: owners.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdminController::owners
 * @see app/Http/Controllers/SuperAdminController.php:17
 * @route '/owners'
 */
        ownersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: owners.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    owners.form = ownersForm
/**
* @see \App\Http\Controllers\SuperAdminController::absensiApproval
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
export const absensiApproval = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: absensiApproval.url(options),
    method: 'get',
})

absensiApproval.definition = {
    methods: ["get","head"],
    url: '/superadmin/absensi-approval',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuperAdminController::absensiApproval
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
absensiApproval.url = (options?: RouteQueryOptions) => {
    return absensiApproval.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuperAdminController::absensiApproval
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
absensiApproval.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: absensiApproval.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuperAdminController::absensiApproval
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
absensiApproval.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: absensiApproval.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuperAdminController::absensiApproval
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
    const absensiApprovalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: absensiApproval.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuperAdminController::absensiApproval
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
        absensiApprovalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: absensiApproval.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuperAdminController::absensiApproval
 * @see app/Http/Controllers/SuperAdminController.php:72
 * @route '/superadmin/absensi-approval'
 */
        absensiApprovalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: absensiApproval.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    absensiApproval.form = absensiApprovalForm
const superadmin = {
    owners: Object.assign(owners, ownersB36aa0),
absensiApproval: Object.assign(absensiApproval, absensiApproval),
}

export default superadmin