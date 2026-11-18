# One-off: applies the facts in the client's leaflet ("Produtos/sotocal desdobrável.pdf", Drive folder Sotocal) to
# store-setup/products.json and collections.json. Texts are rewritten to AO90 and stripped of health and nutrition
# claims (EU 1924/2006): the leaflet's breakfast/weight paragraph and "ricos e nutritivos" are not used.
# Re-run safely: it overwrites the same fields. Then: node store-setup/products-csv.mjs
import json, os
here = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(here, 'products.json')
data = json.load(open(path, encoding='utf-8'))
P = {p['handle']: p for p in data['products']}
P.setdefault('infusao-lucia-lima', P.get('infusao-cidreira'))  # renamed on the first run
SRC = 'Desdobrável Sotocal (cliente)'

def upd(handle, body=None, en_body=None, mf=None, title=None, en_title=None, new_handle=None, en_handle=None, tags_add=()):
    p = P[handle]
    if body: p['body_html'] = body
    if title: p['title'] = title
    if new_handle: p['handle'] = new_handle
    p.setdefault('metafields', {}).update(mf or {})
    p.setdefault('en', {})
    if en_body: p['en']['body_html'] = en_body
    if en_title: p['en']['title'] = en_title
    if en_handle: p['en']['handle'] = en_handle
    for t in tags_add:
        if t not in p['tags']: p['tags'].append(t)
    p['source'] = SRC

COFFEE_FIC = {'fic_origin': 'Torrado em Portugal'}
upd('lote-super-milano',
    '<p><strong>100% café.</strong> O Lote Super Milano junta finos e suaves cafés arábica de montanha com intensos robustas africanos. Desta seleção cuidadosa e de uma torra profissional resulta um café de sabor intenso e persistente, aroma agradavelmente suave e um expresso de creme aveludado e persistente.</p>',
    '<p><strong>100% coffee.</strong> Super Milano brings together fine, smooth mountain Arabicas and intense African Robustas. Careful selection and a professional roast give an intense, lingering taste, a pleasantly soft aroma and an espresso with a velvety, lasting crema.</p>',
    dict(COFFEE_FIC, fic_ingredients='Café torrado (100% café).', arabica_robusta='Arábicas de montanha e robustas africanos'))
upd('lote-super',
    '<p><strong>100% café.</strong> Lote preparado com suaves cafés arábica da América Central e do Brasil e com os melhores cafés robusta da África Ocidental. Desta seleção cuidadosa e de uma torra profissional resulta um café de sabor forte, aroma revigorante e um expresso encorpado, com um creme que persiste.</p>',
    '<p><strong>100% coffee.</strong> A blend of smooth Arabicas from Central America and Brazil with the best West African Robustas. Careful selection and a professional roast give a strong flavour, an invigorating aroma and a full-bodied espresso with a lasting crema.</p>',
    dict(COFFEE_FIC, fic_ingredients='Café torrado (100% café).', arabica_robusta='Arábicas da América Central e do Brasil, robustas da África Ocidental'))
upd('lote-reggio',
    '<p><strong>100% café.</strong> Os mais aromáticos cafés de montanha, combinados com os cafés intensos e fortes das plantações africanas, numa torra intensa de tipo italiano. O resultado é um café enérgico e vigoroso, de sabor forte e aroma ativo: um expresso revigorante, de creme firme.</p>',
    '<p><strong>100% coffee.</strong> The most aromatic mountain coffees, combined with intense, strong coffees from African plantations, in an intense Italian-style roast. The result is an energetic, vigorous coffee with a strong flavour and a lively aroma: an invigorating espresso with a firm crema.</p>',
    dict(COFFEE_FIC, fic_ingredients='Café torrado (100% café).', arabica_robusta='Cafés de montanha e cafés africanos', roast='Torra intensa de tipo italiano'))
upd('cafe-descafeinado',
    '<p>Como todos os lotes Sotocal, o Descafeinado nasce de uma seleção criteriosa das melhores origens e de uma torra feita por profissionais experientes, mas sem cafeína. Foi pensado para quem quer todo o sabor e o aroma de um café Sotocal, sem cafeína.</p>',
    '<p>Like every Sotocal blend, the Decaf starts with a careful selection of the best origins and a roast by experienced professionals, only without the caffeine. It is made for anyone who wants all the flavour and aroma of a Sotocal coffee, without caffeine.</p>',
    dict(COFFEE_FIC, fic_ingredients='Café descafeinado torrado.'))

# Sold to consumers too, at the same price as to cafés (client, 29/10/2026).
HORECA = 'Da gama de produtos complementares que a Sotocal criou para cafés, restaurantes e hotéis, e que também pode comprar para casa.'
HORECA_EN = 'From the range of accompaniments Sotocal created for cafés, restaurants and hotels, which you can also buy for home.'
upd('acucar-sotocal', f'<p>Açúcar Sotocal em carteiras. {HORECA}</p>', f'<p>Sotocal sugar in packets. {HORECA_EN}</p>', title='Açúcar Sotocal em carteiras', en_title='Sotocal sugar packets')
upd('adocante-sotocal', f'<p>Adoçante Sotocal em saquetas. {HORECA}</p>', f'<p>Sotocal sweetener in sachets. {HORECA_EN}</p>')
upd('descafeinado-unidoses', f'<p>Café descafeinado Sotocal em unidoses. {HORECA}</p>', f'<p>Sotocal decaffeinated coffee in single doses. {HORECA_EN}</p>')
upd('cha-verde', f'<p>Chá verde Sotocal. {HORECA}</p>', f'<p>Sotocal green tea. {HORECA_EN}</p>')
upd('cha-preto', f'<p>Chá preto Sotocal. {HORECA}</p>', f'<p>Sotocal black tea. {HORECA_EN}</p>')
upd('infusao-camomila', f'<p>Infusão de camomila Sotocal. {HORECA}</p>', f'<p>Sotocal chamomile infusion. {HORECA_EN}</p>')
# Cidreira is lemon balm, Melissa officinalis (client, 29/10/2026).
upd('infusao-lucia-lima', f'<p>Infusão de cidreira Sotocal (<em>Melissa officinalis</em>). {HORECA}</p>', f'<p>Sotocal lemon balm infusion (<em>Melissa officinalis</em>). {HORECA_EN}</p>',
    title='Infusão de cidreira', new_handle='infusao-cidreira', en_title='Lemon balm infusion', en_handle='lemon-balm-infusion')
upd('amendoins-jumbo-torrados', f'<p>Amendoim Jumbo torrado Sotocal. {HORECA}</p>', f'<p>Sotocal roasted Jumbo peanuts. {HORECA_EN}</p>',
    mf={'fic_allergens': ['Amendoim']}, title='Amendoim Jumbo torrado')

GLUTEN = ['Cevada (cereal que contém glúten)']
upd('mistura-bom-dia',
    '<p>Mistura de 25% de café e 75% de chicória: encorpada, com um aroma forte graças à generosa parte de café. Simples ou com leite.</p>',
    '<p>A blend of 25% coffee and 75% chicory: full-bodied, with a strong aroma from its generous share of coffee. Black or with milk.</p>',
    dict(fic_ingredients='Chicória torrada (75%), café torrado (25%).', character='25% café e 75% chicória.'))
upd('mistura-sako',
    '<p>Mistura de 20% de café e 80% de cereais torrados: cevada, chicória e grão preto.</p>',
    '<p>A blend of 20% coffee and 80% roasted cereals: barley, chicory and grão preto.</p>',
    dict(subtitle='Mistura de café e cereais torrados', character='20% café e 80% cereais torrados.',
         fic_ingredients='Cereais torrados (80%): cevada, chicória e grão preto; café torrado (20%).', fic_allergens=GLUTEN))
upd('cevada-sotocal', '<p>Cevada torrada e moída Sotocal, para preparar como o café. Simples ou com leite.</p>',
    '<p>Sotocal roasted ground barley, made like coffee. Black or with milk.</p>',
    dict(subtitle='Cevada torrada moída', fic_ingredients='Cevada torrada.', fic_allergens=GLUTEN))
upd('cevada-oriente', '<p>Cevada torrada Oriente, da Sotocal, para preparar como o café. Simples ou com leite.</p>',
    '<p>Oriente roasted barley by Sotocal, made like coffee. Black or with milk.</p>',
    dict(fic_ingredients='Cevada torrada.', fic_allergens=GLUTEN))

SPICES = {
  'colorau': ('Também chamado pimentão doce ou paprica, o colorau obtém-se do fruto do pimenteiro doce, seco e moído. Realça a cor e intensifica o sabor dos cozinhados e entra na confeção de alguns enchidos.',
              'Also called sweet pepper or paprika, colorau is made from the fruit of the sweet pepper plant, dried and ground. It brings out the colour and deepens the flavour of cooked dishes, and is used in some cured sausages.',
              'Pimentão doce moído.'),
  'pimenta': ('A pimenta branca e a pimenta preta vêm da mesma planta, a <em>Piper nigrum</em>. De sabor levemente picante, tem um uso quase universal na cozinha: carne, peixe, aves e molhos.',
              'White and black pepper come from the same plant, <em>Piper nigrum</em>. Slightly hot, it is used almost everywhere in the kitchen: meat, fish, poultry and sauces.', None),
  'piri-piri': ('O piri-piri, ou pimenta malagueta (<em>Capsicum frutescens</em>), usa-se seco para temperar e dar picante a muitos pratos, com destaque para o frango de churrasco e as caldeiradas de peixe e marisco.',
                'Piri-piri, or bird’s eye chilli (<em>Capsicum frutescens</em>), is used dried to season and add heat to many dishes, above all barbecued chicken and fish and seafood stews.', 'Malagueta seca.'),
  'canela': ('De aroma forte e quente e sabor levemente adocicado, a canela usa-se sobretudo em doces, mas também para aromatizar o leite ou até o café.',
             'With a strong, warm aroma and a slightly sweet taste, cinnamon is used mostly in desserts, but also to flavour milk or even coffee.', None),
  'cravinho': ('De aroma intenso e sabor forte e ardente, o cravinho usa-se em pratos doces e salgados, em marinadas de carne e caça, para temperar legumes e até para aromatizar licores e sangria.',
               'With an intense aroma and a strong, hot taste, cloves are used in sweet and savoury dishes, in marinades for meat and game, to season vegetables and even to flavour liqueurs and sangria.', 'Cravinho.'),
  'cominhos': ('Obtidos das sementes secas e moídas da planta <em>Cuminum cyminum</em>, os cominhos temperam pratos de carne, sobretudo de porco, e entram na confeção de enchidos.',
               'Made from the dried, ground seeds of <em>Cuminum cyminum</em>, cumin seasons meat dishes, especially pork, and is used in cured sausages.', 'Cominhos moídos.'),
}
for h, (pt, en, ing) in SPICES.items():
    upd(h, f'<p>{pt}</p>', f'<p>{en}</p>', ({'fic_ingredients': ing} if ing else {}))

NOTE = ' Product texts and compositions updated from the client leaflet (store-setup/apply-leaflet.py).'
if NOTE not in data.get('$comment', ''): data['$comment'] = data.get('$comment', '') + NOTE
json.dump(data, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
open(path, 'a', encoding='utf-8').write('\n')

cpath = os.path.join(here, 'collections.json')
c = open(cpath, encoding='utf-8').read()
c = c.replace('açúcar e adoçante em saquetas', 'açúcar em carteiras e adoçante em saquetas').replace('infusões de camomila e de lúcia-lima', 'infusões de camomila e de cidreira')
c = c.replace('chamomile and lemon verbena infusions', 'chamomile and lemon balm infusions')
open(cpath, 'w', encoding='utf-8').write(c)
print('updated', len(data['products']), 'products')
