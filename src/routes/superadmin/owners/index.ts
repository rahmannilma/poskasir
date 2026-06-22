import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
const owners = {
    toggleStatus: Object.assign(toggleStatus, toggleStatus),
}

export default owners