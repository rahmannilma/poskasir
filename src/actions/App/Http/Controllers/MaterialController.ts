import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\MaterialController::storeMaterial
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
export const storeMaterial = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMaterial.url(options),
    method: 'post',
})

storeMaterial.definition = {
    methods: ["post"],
    url: '/materials/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MaterialController::storeMaterial
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
storeMaterial.url = (options?: RouteQueryOptions) => {
    return storeMaterial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::storeMaterial
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
storeMaterial.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMaterial.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MaterialController::storeMaterial
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
    const storeMaterialForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMaterial.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::storeMaterial
 * @see app/Http/Controllers/MaterialController.php:31
 * @route '/materials/items'
 */
        storeMaterialForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMaterial.url(options),
            method: 'post',
        })
    
    storeMaterial.form = storeMaterialForm
/**
* @see \App\Http\Controllers\MaterialController::updateMaterial
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
export const updateMaterial = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMaterial.url(args, options),
    method: 'put',
})

updateMaterial.definition = {
    methods: ["put"],
    url: '/materials/items/{material}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MaterialController::updateMaterial
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
updateMaterial.url = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateMaterial.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::updateMaterial
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
updateMaterial.put = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMaterial.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\MaterialController::updateMaterial
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
    const updateMaterialForm = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateMaterial.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::updateMaterial
 * @see app/Http/Controllers/MaterialController.php:51
 * @route '/materials/items/{material}'
 */
        updateMaterialForm.put = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateMaterial.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateMaterial.form = updateMaterialForm
/**
* @see \App\Http\Controllers\MaterialController::destroyMaterial
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
export const destroyMaterial = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMaterial.url(args, options),
    method: 'delete',
})

destroyMaterial.definition = {
    methods: ["delete"],
    url: '/materials/items/{material}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MaterialController::destroyMaterial
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
destroyMaterial.url = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyMaterial.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::destroyMaterial
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
destroyMaterial.delete = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMaterial.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MaterialController::destroyMaterial
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
    const destroyMaterialForm = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyMaterial.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::destroyMaterial
 * @see app/Http/Controllers/MaterialController.php:71
 * @route '/materials/items/{material}'
 */
        destroyMaterialForm.delete = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyMaterial.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyMaterial.form = destroyMaterialForm
/**
* @see \App\Http\Controllers\MaterialController::updateProductRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
export const updateProductRecipe = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProductRecipe.url(args, options),
    method: 'post',
})

updateProductRecipe.definition = {
    methods: ["post"],
    url: '/materials/products/{product}/recipe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MaterialController::updateProductRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
updateProductRecipe.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateProductRecipe.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MaterialController::updateProductRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
updateProductRecipe.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProductRecipe.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MaterialController::updateProductRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
    const updateProductRecipeForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProductRecipe.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MaterialController::updateProductRecipe
 * @see app/Http/Controllers/MaterialController.php:85
 * @route '/materials/products/{product}/recipe'
 */
        updateProductRecipeForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProductRecipe.url(args, options),
            method: 'post',
        })
    
    updateProductRecipe.form = updateProductRecipeForm
const MaterialController = { index, storeMaterial, updateMaterial, destroyMaterial, updateProductRecipe }

export default MaterialController