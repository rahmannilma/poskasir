import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MaterialController::index
 * @see app/Http/Controllers/MaterialController.php:17
 * @route '/materials'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/materials',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MaterialController::index
 * @see app/Http/Controllers/MaterialController.php:17
 * @route '/materials'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::index
 * @see app/Http/Controllers/MaterialController.php:17
 * @route '/materials'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MaterialController::index
 * @see app/Http/Controllers/MaterialController.php:17
 * @route '/materials'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MaterialController::index
 * @see app/Http/Controllers/MaterialController.php:17
 * @route '/materials'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MaterialController::index
 * @see app/Http/Controllers/MaterialController.php:17
 * @route '/materials'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MaterialController::index
 * @see app/Http/Controllers/MaterialController.php:17
 * @route '/materials'
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
* @see \App\Http\Controllers\MaterialController::storeItem
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
export const storeItem = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(options),
    method: 'post',
})

storeItem.definition = {
    methods: ["post"],
    url: '/materials/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MaterialController::storeItem
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
storeItem.url = (options?: RouteQueryOptions) => {
    return storeItem.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::storeItem
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
storeItem.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MaterialController::storeItem
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
    const storeItemForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeItem.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::storeItem
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
        storeItemForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeItem.url(options),
            method: 'post',
        })
    
    storeItem.form = storeItemForm
/**
* @see \App\Http\Controllers\MaterialController::updateItem
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
export const updateItem = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

updateItem.definition = {
    methods: ["put"],
    url: '/materials/items/{material}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MaterialController::updateItem
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
updateItem.url = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { material: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { material: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    material: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        material: typeof args.material === 'object'
                ? args.material.id
                : args.material,
                }

    return updateItem.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::updateItem
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
updateItem.put = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\MaterialController::updateItem
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
    const updateItemForm = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::updateItem
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
        updateItemForm.put = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateItem.form = updateItemForm
/**
* @see \App\Http\Controllers\MaterialController::destroyItem
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
export const destroyItem = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

destroyItem.definition = {
    methods: ["delete"],
    url: '/materials/items/{material}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MaterialController::destroyItem
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
destroyItem.url = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { material: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { material: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    material: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        material: typeof args.material === 'object'
                ? args.material.id
                : args.material,
                }

    return destroyItem.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::destroyItem
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
destroyItem.delete = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MaterialController::destroyItem
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
    const destroyItemForm = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::destroyItem
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
        destroyItemForm.delete = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyItem.form = destroyItemForm
/**
* @see \App\Http\Controllers\MaterialController::updateRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
export const updateRecipe = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateRecipe.url(args, options),
    method: 'post',
})

updateRecipe.definition = {
    methods: ["post"],
    url: '/materials/products/{product}/recipe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MaterialController::updateRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
updateRecipe.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return updateRecipe.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::updateRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
updateRecipe.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateRecipe.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MaterialController::updateRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
    const updateRecipeForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateRecipe.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::updateRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
        updateRecipeForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateRecipe.url(args, options),
            method: 'post',
        })
    
    updateRecipe.form = updateRecipeForm
const materials = {
    index: Object.assign(index, index),
storeItem: Object.assign(storeItem, storeItem),
updateItem: Object.assign(updateItem, updateItem),
destroyItem: Object.assign(destroyItem, destroyItem),
updateRecipe: Object.assign(updateRecipe, updateRecipe),
}

export default materials