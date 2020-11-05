import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let routerStub;

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ MainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("Log out testing", function () {
    it("log out should navigate to Log in page", function () {
      component.logout();
      expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
