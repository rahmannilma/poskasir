import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TableController::index
 * @see app/Http/Controllers/TableController.php:17
 * @route '/tables'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TableController::index
 * @see app/Http/Controllers/TableController.php:17
 * @route '/tables'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableController::index
 * @see app/Http/Controllers/TableController.php:17
 * @route '/tables'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TableController::index
 * @see app/Http/Controllers/TableController.php:17
 * @route '/tables'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TableController::index
 * @see app/Http/Controllers/TableController.php:17
 * @route '/tables'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TableController::index
 * @see app/Http/Controllers/TableController.php:17
 * @route '/tables'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TableController::index
 * @see app/Http/Controllers/TableController.php:17
 * @route '/tables'
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
* @see \App\Http\Controllers\TableController::store
 * @see app/Http/Controllers/TableController.php:38
 * @route '/tables'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TableController::store
 * @see app/Http/Controllers/TableController.php:38
 * @route '/tables'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableController::store
 * @see app/Http/Controllers/TableController.php:38
 * @route '/tables'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TableController::store
 * @see app/Http/Controllers/TableController.php:38
 * @route '/tables'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TableController::store
 * @see app/Http/Controllers/TableController.php:38
 * @route '/tables'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TableController::update
 * @see app/Http/Controllers/TableController.php:69
 * @route '/tables/{table}'
 */
export const update = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/tables/{table}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TableController::update
 * @see app/Http/Controllers/TableController.php:69
 * @route '/tables/{table}'
 */
update.url = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { table: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { table: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    table: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        table: typeof args.table === 'object'
                ? args.table.id
                : args.table,
                }

    return update.definition.url
            .replace('{table}', parsedArgs.table.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableController::update
 * @see app/Http/Controllers/TableController.php:69
 * @route '/tables/{table}'
 */
update.put = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TableController::update
 * @see app/Http/Controllers/TableController.php:69
 * @route '/tables/{table}'
 */
update.patch = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TableController::update
 * @see app/Http/Controllers/TableController.php:69
 * @route '/tables/{table}'
 */
    const updateForm = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TableController::update
 * @see app/Http/Controllers/TableController.php:69
 * @route '/tables/{table}'
 */
        updateForm.put = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TableController::update
 * @see app/Http/Controllers/TableController.php:69
 * @route '/tables/{table}'
 */
        updateForm.patch = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\TableController::destroy
 * @see app/Http/Controllers/TableController.php:103
 * @route '/tables/{table}'
 */
export const destroy = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tables/{table}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TableController::destroy
 * @see app/Http/Controllers/TableController.php:103
 * @route '/tables/{table}'
 */
destroy.url = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { table: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { table: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    table: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        table: typeof args.table === 'object'
                ? args.table.id
                : args.table,
                }

    return destroy.definition.url
            .replace('{table}', parsedArgs.table.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableController::destroy
 * @see app/Http/Controllers/TableController.php:103
 * @route '/tables/{table}'
 */
destroy.delete = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TableController::destroy
 * @see app/Http/Controllers/TableController.php:103
 * @route '/tables/{table}'
 */
    const destroyForm = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TableController::destroy
 * @see app/Http/Controllers/TableController.php:103
 * @route '/tables/{table}'
 */
        destroyForm.delete = (args: { table: number | { id: number } } | [table: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TableController = { index, store, update, destroy }

export default TableController