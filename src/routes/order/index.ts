import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::menu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
export const menu = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: menu.url(args, options),
    method: 'get',
})

menu.definition = {
    methods: ["get","head"],
    url: '/order/{table}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::menu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
menu.url = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { table: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    table: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        table: args.table,
                }

    return menu.definition.url
            .replace('{table}', parsedArgs.table.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::menu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
menu.get = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: menu.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::menu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
menu.head = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: menu.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::menu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
    const menuForm = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: menu.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::menu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
        menuForm.get = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: menu.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::menu
 * @see app/Http/Controllers/TransactionController.php:630
 * @route '/order/{table}'
 */
        menuForm.head = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: menu.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    menu.form = menuForm
/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
export const store = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/order/{table}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
store.url = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { table: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    table: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        table: args.table,
                }

    return store.definition.url
            .replace('{table}', parsedArgs.table.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
store.post = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
    const storeForm = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:665
 * @route '/order/{table}'
 */
        storeForm.post = (args: { table: string | number } | [table: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const order = {
    menu: Object.assign(menu, menu),
store: Object.assign(store, store),
}

export default order