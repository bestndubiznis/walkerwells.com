const {test,expect}=require('@playwright/test');
async function enter(page,room='garage'){
 await page.goto('/#'+room);await page.getByRole('button',{name:'ENTER ESTATE',exact:true}).click();
 await expect(page.locator('#boot')).toHaveCount(0);
}
async function object(page,label,mobile){
 await page.getByRole('button',{name:label,exact:!mobile}).filter({visible:true}).first().click();
}
test('rooms, responsive canvas, panels and game retry work without JS errors',async({page,isMobile})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await enter(page);
 const rooms=['estate','manor','study','wardrobe','garage','archive','map','camp','nyc'];
 for(const room of rooms){
  await page.goto('/#'+room);await expect(page.locator('body')).toHaveAttribute('data-scene',room);
  const scene=await page.locator('#scene').boundingBox();expect(scene.width/scene.height).toBeCloseTo(16/9,2);
  await expect(page.locator('#sceneBg')).toBeVisible();
 }
 await page.goto('/#garage');await expect(page.locator('body')).toHaveAttribute('data-scene','garage');
 if(isMobile){await page.getByRole('button',{name:'ENLARGE ROOM',exact:true}).click();await expect(page.locator('#roomViewport')).toHaveClass('pannable');await page.getByRole('button',{name:'SHOW WHOLE ROOM'}).click()}
 await object(page,'DIRT BIKE',isMobile);await page.getByRole('button',{name:'HIT THE TRAIL →'}).click();
 await expect(page.locator('#garageRun')).toHaveAttribute('data-phase','running');
 await page.getByRole('button',{name:'PAUSE',exact:true}).click();await page.getByRole('button',{name:'NEW RUN',exact:true}).click();
 await expect(page.locator('#garageRun')).toHaveAttribute('data-phase','ready');await page.getByRole('button',{name:'EXIT ×'}).click();await expect(page.locator('#garageRun')).toHaveCount(0);
 expect(errors).toEqual([]);
});
test('room outfit and Suit Up share the equipped state and reward',async({page,isMobile})=>{
 await enter(page,'wardrobe');await object(page,'WEB SUIT',isMobile);
 await page.getByRole('button',{name:'Close',exact:true}).click();
 if(isMobile)await page.getByRole('button',{name:'ESTATE CONTROLS',exact:true}).click();
 await page.getByRole('button',{name:'SUIT UP',exact:true}).click();
 await expect(page.locator('#currentSuit')).toHaveText('CURRENT: SPIDER SUIT');
 await expect(page.locator('[data-suit="SPIDER SUIT"]')).toHaveClass(/on/);
 await page.locator('[data-suit="SPIDER SUIT"]').click();
 await expect(page.locator('#currentSuit')).toHaveText('CURRENT: SPIDER SUIT');
});

test('hotspots stay attached to the room when a desktop viewport changes shape',async({page,isMobile})=>{
 test.skip(isMobile);await enter(page,'wardrobe');
 for(const size of [{width:1280,height:720},{width:1000,height:900},{width:1600,height:900}]){
  await page.setViewportSize(size);
  await expect.poll(async()=>{const r=await page.locator('#scene').boundingBox();return Math.round(r.width/r.height*1000)}).toBe(1778);
  const r=await page.locator('#scene').boundingBox(),hot=await page.locator('[data-hot="1"]').boundingBox();
  expect((hot.x+hot.width/2-r.x)/r.width).toBeCloseTo(.24,2);
 }
});
