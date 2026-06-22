import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:20
 * @route '/shifts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/shifts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:20
 * @route '/shifts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:20
 * @route '/shifts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:20
 * @route '/shifts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:20
 * @route '/shifts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:20
 * @route '/shifts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:20
 * @route '/shifts'
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
* @see \App\Http\Controllers\ShiftController::open
 * @see app/Http/Controllers/ShiftController.php:51
 * @route '/shifts/open'
 */
export const open = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

open.definition = {
    methods: ["post"],
    url: '/shifts/open',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ShiftController::open
 * @see app/Http/Controllers/ShiftController.php:51
 * @route '/shifts/open'
 */
open.url = (options?: RouteQueryOptions) => {
    return open.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShiftController::open
 * @see app/Http/Controllers/ShiftController.php:51
 * @route '/shifts/open'
 */
open.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ShiftController::open
 * @see app/Http/Controllers/ShiftController.php:51
 * @route '/shifts/open'
 */
    const openForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: open.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ShiftController::open
 * @see app/Http/Controllers/ShiftController.php:51
 * @route '/shifts/open'
 */
        openForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: open.url(options),
            method: 'post',
        })
    
    open.form = openForm
/**
* @see \App\Http\Controllers\ShiftController::close
 * @see app/Http/Controllers/ShiftController.php:93
 * @route '/shifts/close'
 */
export const close = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/shifts/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ShiftController::close
 * @see app/Http/Controllers/ShiftController.php:93
 * @route '/shifts/close'
 */
close.url = (options?: RouteQueryOptions) => {
    return close.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShiftController::close
 * @see app/Http/Controllers/ShiftController.php:93
 * @route '/shifts/close'
 */
close.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ShiftController::close
 * @see app/Http/Controllers/ShiftController.php:93
 * @route '/shifts/close'
 */
    const closeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ShiftController::close
 * @see app/Http/Controllers/ShiftController.php:93
 * @route '/shifts/close'
 */
        closeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(options),
            method: 'post',
        })
    
    close.form = closeForm
const shifts = {
    index: Object.assign(index, index),
open: Object.assign(open, open),
close: Object.assign(close, close),
}

export default shifts